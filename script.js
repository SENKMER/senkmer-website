(function () {
  'use strict';

  // --------- Utilities ---------
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function el(tag, props = {}) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  }

  // Escape user-provided text for safe insertion into HTML (prevent XSS)
  function escapeHtml(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Smooth scrolling for in-page links
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile nav if open
      closeMobileNav();
    }
  });

  // Set current year in footer
  qs('#year').textContent = new Date().getFullYear();

  // ---------- Mobile nav ----------
  const navToggle = qs('.nav-toggle');
  const navList = qs('#nav-list');
  navToggle && navToggle.addEventListener('click', toggleNav);
  function toggleNav() {
    const open = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  }
  function closeMobileNav() {
    if (navList.classList.contains('open')) {
      navList.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  // ---------- Hero "Try a game" button ----------
  qs('#hero-try-game') && qs('#hero-try-game').addEventListener('click', function () {
    const games = document.getElementById('games');
    if (games) games.scrollIntoView({ behavior: 'smooth' });
    // auto-start quiz
    setTimeout(() => startQuiz(), 450);
  });

  // ---------- Modules / Practice (simulate progress) ----------
  qsa('.start-module').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('.module');
      simulatePractice(card);
    });
  });

  function simulatePractice(card) {
    if (!card) return;
    const bar = card.querySelector('.progress-bar');
    const xpEl = card.querySelector('.xp strong');
    const levelEl = card.querySelector('.level-value');

    // parse current values
    const currentPercent = parseInt((bar.style.width || '0').replace('%',''), 10) || 0;
    const newPercent = Math.min(100, currentPercent + (10 + Math.floor(Math.random()*25)));
    bar.style.width = newPercent + '%';

    // update XP
    const currentXp = parseInt(xpEl.textContent, 10) || 0;
    const gained = 10 + Math.floor(Math.random()*40);
    xpEl.textContent = currentXp + gained;

    // possibly level up
    const levelVal = parseInt(levelEl.textContent, 10) || 0;
    if (newPercent >= 100) {
      levelEl.textContent = levelVal + 1;
      bar.style.width = '0%';
      // small confetti-ish effect (CSS-only subtle)
      card.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)'}], { duration: 420 });
    }
  }

  // ---------- Quiz Game ----------
  const quizData = [
    { q: 'Which of these is a programming language?', opts: ['HTML', 'CSS', 'JavaScript', 'HTTP'], a: 2 },
    { q: 'What does XP usually stand for in gamified learning?', opts: ['Experience Points', 'Extra Practice', 'Excellent Progress', 'Expedited Push'], a: 0 },
    { q: 'Which action helps long-term learning the most?', opts: ['Cramming', 'Spacing practice', 'Watching once', 'Ignoring mistakes'], a: 1 }
  ];

  let quizState = { index: 0, score: 0, active: false };

  const quizEl = qs('#quiz');
  const qQuestion = qs('#quiz-question');
  const qOptions = qs('#quiz-options');
  const qNext = qs('#quiz-next');
  const qReset = qs('#quiz-reset');
  const qScore = qs('#quiz-score');
  const startQuizBtn = qs('#start-quiz');

  startQuizBtn && startQuizBtn.addEventListener('click', startQuiz);
  qReset && qReset.addEventListener('click', resetQuiz);
  qNext && qNext.addEventListener('click', () => {
    quizState.index++;
    if (quizState.index >= quizData.length) {
      endQuiz();
    } else {
      renderQuestion();
    }
  });

  function startQuiz() {
    quizState = { index: 0, score: 0, active: true };
    qScore.textContent = 'Score: 0';
    renderQuestion();
    qs('#quiz-next').disabled = true;
  }

  function resetQuiz() {
    startQuiz();
  }

  function renderQuestion() {
    const cur = quizData[quizState.index];
    qQuestion.textContent = cur.q;
    qOptions.innerHTML = '';
    cur.opts.forEach((opt, idx) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option';
      button.textContent = opt;
      button.addEventListener('click', () => handleAnswer(idx, button));
      qOptions.appendChild(button);
    });
    qNext.disabled = true;
  }

  function handleAnswer(choice, buttonEl) {
    if (!quizState.active) return;
    const cur = quizData[quizState.index];
    const correct = cur.a === choice;
    // mark options
    qOptions.querySelectorAll('.option').forEach(b => b.disabled = true);
    if (correct) {
      buttonEl.classList.add('correct');
      quizState.score++;
      qScore.textContent = `Score: ${quizState.score}`;
    } else {
      buttonEl.classList.add('wrong');
      // highlight correct
      const opts = qOptions.querySelectorAll('.option');
      if (opts[cur.a]) opts[cur.a].classList.add('correct');
    }
    qNext.disabled = false;
    // small aria feedback
    qQuestion.setAttribute('aria-live','polite');
    if (quizState.index === quizData.length - 1) {
      qNext.textContent = 'Finish';
    } else {
      qNext.textContent = 'Next';
    }
  }

  function endQuiz() {
    quizState.active = false;
    qQuestion.textContent = 'Finished! Your score: ' + quizState.score + ' / ' + quizData.length;
    qOptions.innerHTML = '';
    qNext.disabled = true;
    // simulate awarding small XP / celebration
    if (quizState.score === quizData.length) {
      qScore.textContent = `Score: ${quizState.score} — Perfect! +50 XP`;
    }
  }

  // initialize quiz preview (non-started)
  (function initQuizPreview() {
    qQuestion.textContent = 'Press "Start Quiz" to begin';
    qOptions.innerHTML = '';
  }());

  // ---------- Chatbot ----------
  const chatForm = qs('#chat-form');
  const chatInput = qs('#chat-input');
  const chatWindow = qs('#chat-window');

  const canned = [
    { keywords: ['xp','experience'], resp: 'You earn XP by completing modules and doing well in games. Keep practicing!' },
    { keywords: ['account','login','signup'], resp: 'Accounts are coming soon. We will support sign-up and sync across devices.' },
    { keywords: ['price','free','cost'], resp: 'Senkmer basic features are free in this demo. Pricing will be announced later.' },
    { keywords: ['report','bug'], resp: 'Thanks for reporting bugs! Please use the contact form below or email support@senkmer.example.' },
    { keywords: ['contact','support'], resp: 'You can contact us with the form on this page. We aim to respond within 48 hours (demo).' },
  ];

  chatForm && chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const raw = chatInput.value.trim();
    if (!raw) return;
    const safe = escapeHtml(raw);
    appendChat('user', safe);
    chatInput.value = '';
    setTimeout(() => {
      const reply = chatbotReply(raw);
      appendChat('bot', reply);
      // auto-scroll
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 300 + Math.random() * 600);
  });

  function appendChat(who, text) {
    const div = document.createElement('div');
    div.className = who === 'user' ? 'user-message' : 'bot-message';
    div.textContent = text;
    chatWindow.appendChild(div);
    // keep last N messages
    while (chatWindow.children.length > 80) { chatWindow.removeChild(chatWindow.firstChild); }
  }

  function chatbotReply(input) {
    const inLower = input.toLowerCase();
    for (const item of canned) {
      for (const k of item.keywords) {
        if (inLower.includes(k)) return item.resp;
      }
    }
    // if unknown
    return "I'm still learning — here's how to contact us: use the Contact form on this page or email support@senkmer.example. Meanwhile, try asking about 'XP' or 'games'.";
  }

  // ---------- Contact form validation & simulated submission ----------
  const contactForm = qs('#contact-form');
  const nameInput = qs('#c-name');
  const emailInput = qs('#c-email');
  const messageInput = qs('#c-message');
  const resultEl = qs('#form-result');

  contactForm && contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    let ok = true;
    if (!name) { showError('err-name', 'Please enter your name'); ok = false; }
    if (!validateEmail(email)) { showError('err-email', 'Please enter a valid email'); ok = false; }
    if (!message || message.length < 6) { showError('err-message', 'Message must be at least 6 characters'); ok = false; }

    if (!ok) return;

    // simulate network delay & success
    resultEl.textContent = 'Sending…';
    resultEl.style.color = '';
    setTimeout(() => {
      resultEl.textContent = 'Message sent — thank you! We will respond shortly.';
      // reset form safely
      contactForm.reset();
      // for demo, append bot suggestion
      appendChat('bot', 'Thanks! We received your message (demo).');
    }, 900);
  });

  function validateEmail(email) {
    // simple email regex (frontend only)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function showError(id, msg) { qs('#' + id).textContent = msg; }
  function clearErrors() {
    qs('#err-name').textContent = '';
    qs('#err-email').textContent = '';
    qs('#err-message').textContent = '';
    resultEl.textContent = '';
  }

  // ---------- Accessibility helpers ----------
  // Close mobile nav on escape
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileNav();
  });

  // ---------- Initialization ----------
  // Enable nav links to reflect focused section (optional improvement)
  function init() {
    // Add click handler to start-quiz on hero quick entry
    const startQuizBtn = qs('#start-quiz');
    if (startQuizBtn) startQuizBtn.addEventListener('click', () => {
      startQuiz();
      const gamesSection = document.getElementById('games');
      if (gamesSection) gamesSection.scrollIntoView({behavior:'smooth', block:'start'});
    });

    // if user clicks any nav link, close mobile nav (handled earlier)
    // ensure chat window initial message is accessible
    chatWindow && (chatWindow.scrollTop = chatWindow.scrollHeight);
  }

  // run init
  init();

  // Export some functions for debugging from console (development only)
  window.Senkmer = {
    startQuiz,
    resetQuiz,
    simulatePractice,
    chatbotReply
  };

  // End of IIFE
}());