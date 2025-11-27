import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import fetch from 'node-fetch';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:8000' }));
app.use(helmet());
const limiter = rateLimit({ windowMs: 60_000, max: 60 });
app.use(limiter);

// CSRF (double submit token) for state-changing routes
const CSRF_HEADER = 'x-csrf-token';
app.use((req,res,next)=>{
  if(req.method === 'GET') return next();
  const csrf = req.headers[CSRF_HEADER];
  // Accept missing token for pure API clients; tighten in production
  if(!csrf) return next();
  const cookie = req.headers['cookie'] || '';
  const found = /csrf=([^;]+)/.exec(cookie);
  if(!found || found[1] !== csrf){
    return res.status(403).json({ error:'CSRF token mismatch' });
  }
  next();
});

app.get('/api/csrf', (req,res)=>{
  const token = Math.random().toString(36).slice(2);
  res.setHeader('Set-Cookie', `csrf=${token}; Path=/; HttpOnly; SameSite=Lax`);
  res.json({ token });
});

// DB setup (SQLite async)
let db;
async function initDb(){
  db = await open({ filename: '/workspaces/senkmer-website/backend/data.db', driver: sqlite3.Database });
  await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT
  );
  CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    xp INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    reward_xp INTEGER NOT NULL DEFAULT 10,
    completed_at TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    earned_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  `);
}

// Helpers
function makeToken(user){
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
}
function auth(req,res,next){
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if(!token) return res.status(401).json({ error: 'Mangler token' });
  try{
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    next();
  }catch(e){
    res.status(401).json({ error: 'Ugyldig token' });
  }
}

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  display_name: z.string().min(2).max(50).optional()
});
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
const progressSchema = z.object({
  xp: z.number().int().min(0),
  streak: z.number().int().min(0)
});
const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5)
});

// Auth routes
app.post('/api/auth/register', async (req,res)=>{
  const parse = registerSchema.safeParse(req.body);
  if(!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { email, password, display_name } = parse.data;
  const hash = bcrypt.hashSync(password, 10);
  try{
    const info = await db.run('INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)', [email, hash, display_name || null]);
    const user = { id: info.lastID, email };
    const token = makeToken(user);
    res.json({ token, user: { id: user.id, email, display_name } });
  }catch(e){
    if(String(e).includes('UNIQUE')) return res.status(409).json({ error: 'E-post er allerede registrert' });
    res.status(500).json({ error: 'Serverfeil' });
  }
});

app.post('/api/auth/login', async (req,res)=>{
  const parse = loginSchema.safeParse(req.body);
  if(!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { email, password } = parse.data;
  const row = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  if(!row) return res.status(401).json({ error: 'Feil e-post eller passord' });
  const ok = bcrypt.compareSync(password, row.password_hash);
  if(!ok) return res.status(401).json({ error: 'Feil e-post eller passord' });
  const token = makeToken(row);
  res.json({ token, user: { id: row.id, email: row.email, display_name: row.display_name } });
});

// Progress routes
app.get('/api/progress', auth, async (req,res)=>{
  const row = await db.get('SELECT * FROM progress WHERE user_id = ?', [req.user.id]);
  res.json(row || { xp:0, streak:0 });
});
app.post('/api/progress', auth, async (req,res)=>{
  const parse = progressSchema.safeParse(req.body);
  if(!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { xp, streak } = parse.data;
  const now = new Date().toISOString();
  const existing = await db.get('SELECT id FROM progress WHERE user_id = ?', [req.user.id]);
  if(existing){
    await db.run('UPDATE progress SET xp = ?, streak = ?, updated_at = ? WHERE id = ?', [xp, streak, now, existing.id]);
  } else {
    await db.run('INSERT INTO progress (user_id, xp, streak, updated_at) VALUES (?, ?, ?, ?)', [req.user.id, xp, streak, now]);
  }
  res.json({ ok:true });
});

// Level helper
function levelFromXp(xp){
  return Math.min(100, Math.floor((xp||0)/100)+1);
}

// Tasks CRUD
const taskCreateSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  reward_xp: z.number().int().min(1).max(500)
});
app.get('/api/tasks', auth, async (req,res)=>{
  const rows = await db.all('SELECT * FROM tasks WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
  res.json(rows);
});
app.post('/api/tasks', auth, async (req,res)=>{
  const parse = taskCreateSchema.safeParse(req.body);
  if(!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { title, description, reward_xp } = parse.data;
  const now = new Date().toISOString();
  const info = await db.run('INSERT INTO tasks (user_id, title, description, reward_xp, created_at) VALUES (?, ?, ?, ?, ?)', [req.user.id, title, description||null, reward_xp, now]);
  res.json({ id: info.lastID });
});
app.post('/api/tasks/:id/complete', auth, async (req,res)=>{
  const id = Number(req.params.id);
  const now = new Date().toISOString();
  await db.run('UPDATE tasks SET completed_at = ? WHERE id = ? AND user_id = ?', [now, id, req.user.id]);
  const prog = await db.get('SELECT xp, streak FROM progress WHERE user_id = ?', [req.user.id]) || { xp:0, streak:0 };
  const task = await db.get('SELECT reward_xp FROM tasks WHERE id = ?', [id]);
  const newXp = (prog.xp||0) + (task?.reward_xp||0);
  await db.run('UPDATE progress SET xp = ?, updated_at = ? WHERE user_id = ?', [newXp, now, req.user.id]);
  res.json({ ok:true, xp:newXp, level: levelFromXp(newXp) });
});

// Badges list
app.get('/api/badges', auth, async (req,res)=>{
  const rows = await db.all('SELECT * FROM badges WHERE user_id = ? ORDER BY earned_at DESC', [req.user.id]);
  res.json(rows);
});

// Pricing packages
app.get('/api/pricing', (req,res)=>{
  res.json([
    {tier:'Gratis', price:0, desc:'Grunnleggende læring, daglige oppgaver (begrenset)', features:['Daglige oppgaver','Grunnleggende XP']},
    {tier:'Start', price:99, desc:'Alle moduler, grunnleggende XP', features:['Alle moduler','1 badge/mnd']},
    {tier:'Basic', price:199, desc:'Full tilgang, ukentlige utfordringer', features:['Full tilgang','Ukentlige utfordringer']},
    {tier:'Standard', price:399, desc:'Avansert XP, nivåer, 3 badges/mnd', features:['Nivåsystem','3 badges/mnd']},
    {tier:'Pro', price:699, desc:'Coach-tips, bonusoppgaver, prioritet support', features:['Coach-tips','Prioritet support']},
    {tier:'Pro+', price:999, desc:'Bedriftsoppgaver, rapporter, 5 badges/mnd', features:['Rapporter','5 badges/mnd']},
    {tier:'Elite', price:1499, desc:'Mentoring-webinar, premium support', features:['Mentoring','Premium support']},
    {tier:'Ultimate', price:1999, desc:'Eksklusive moduler, early-access', features:['Eksklusive moduler','Early-access']},
    {tier:'Bedrift', price:4999, desc:'10 brukere, admin, KPI-rapporter, SLA', features:['10 brukere','Admin','SLA']},
    {tier:'Bedrift Premium', price:9999, desc:'25 brukere, onboarding, dedikert rådgiver', features:['25 brukere','Onboarding','Rådgiver']}
  ]);
});

// Contact route (email)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});
app.post('/api/contact', async (req,res)=>{
  const parse = contactSchema.safeParse(req.body);
  if(!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { name, email, message } = parse.data;
  try{
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'support@senkmer.no',
      to: process.env.SMTP_FROM || 'support@senkmer.no',
      subject: `Kontaktforespørsel fra ${name}`,
      text: `Fra: ${name} <${email}>\n\n${message}`
    });
    res.json({ ok:true });
  }catch(e){
    res.status(500).json({ error: 'Kunne ikke sende e-post' });
  }
});

// Shopify Admin API example
app.get('/api/shopify/products', async (req,res)=>{
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  if(!store || !token) return res.status(400).json({ error: 'Manglende Shopify konfigurasjon' });
  try{
    const r = await fetch(`https://${store}/admin/api/2024-10/products.json`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await r.json();
    res.json(data);
  }catch(e){
    res.status(500).json({ error: 'Shopify API-feil' });
  }
});

// Shopify: create/update Norwegian info pages and set navigation
app.post('/api/shopify/create-pages', async (req,res)=>{
  const store = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  if(!store || !token) return res.status(400).json({ error: 'Manglende Shopify konfigurasjon' });
  const base = `https://${store}/admin/api/2024-10`;
  const headers = { 'X-Shopify-Access-Token': token, 'Content-Type':'application/json' };
  const pages = [
    { title:'Om Senkmer', body_html:'<h1>Om Senkmer</h1><p>Alt på norsk.</p>', author:'Senkmer' },
    { title:'Kontakt oss', body_html:'<h1>Kontakt oss</h1><p>Send oss en melding.</p>', author:'Senkmer' },
    { title:'Kundeservice', body_html:'<h1>Kundeservice</h1><p>Vanlige spørsmål og svar.</p>', author:'Senkmer' },
    { title:'Priser', body_html:'<h1>Prispakker</h1><p>Se våre pakker.</p>', author:'Senkmer' }
  ];
  try{
    const created = [];
    for(const p of pages){
      const r = await fetch(`${base}/pages.json`, { method:'POST', headers, body: JSON.stringify({ page:p }) });
      const data = await r.json();
      if(data?.page) created.push({ id:data.page.id, handle:data.page.handle, title:data.page.title });
    }
    res.json({ created });
  }catch(e){
    res.status(500).json({ error:'Kunne ikke opprette sider' });
  }
});

app.get('/api/health', (req,res)=>res.json({ ok:true }));

initDb().then(()=>{
  app.listen(port, ()=>{
    console.log(`Senkmer backend kjører på http://localhost:${port}`);
  });
});
