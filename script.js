document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- mobile nav ---------- */
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- reduced motion check ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- scroll reveal ---------- */
const revealEls = document.querySelectorAll(
  '.hero-copy, .hero-visual, .about-copy, .quick-facts, .record-card, .timeline-row, .ledger-row, .balance-side, .contact-cards, .contact-grid > div'
);
revealEls.forEach(el => el.classList.add('reveal'));

if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
}

/* ---------- count-up metrics ---------- */
const metrics = document.querySelectorAll('.metric[data-count]');
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffixEl = el.querySelector('.num');
  const duration = 1100;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    suffixEl.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  if (reduceMotion) {
    suffixEl.textContent = target;
  } else {
    requestAnimationFrame(tick);
  }
}
if (metrics.length) {
  const metricIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        metricIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  metrics.forEach(m => metricIO.observe(m));
}

/* ---------- hero verification panel (signature element) ---------- */
const verifyTasks = [
  { task: 'order_reconciliation.xlsx', status: 'VERIFIED — 99.4% accuracy' },
  { task: 'vendor_data_import.csv',     status: 'VERIFIED — 0 errors found' },
  { task: 'research_summary.docx',      status: 'AI-ASSISTED — fact-checked & verified' },
  { task: 'monthly_report.xlsx',        status: 'VERIFIED — on schedule' },
];

const typedEl = document.getElementById('verifyTyped');
const statusEl = document.getElementById('verifyStatus');

function wait(ms) { return new Promise(res => setTimeout(res, ms)); }

async function runVerifyLoop() {
  if (!typedEl || !statusEl) return;

  if (reduceMotion) {
    typedEl.textContent = verifyTasks[0].task;
    statusEl.textContent = verifyTasks[0].status;
    return;
  }

  let i = 0;
  while (true) {
    const item = verifyTasks[i % verifyTasks.length];
    typedEl.textContent = '';
    statusEl.textContent = '';
    statusEl.style.opacity = 0;

    for (const ch of item.task) {
      typedEl.textContent += ch;
      await wait(38);
    }

    await wait(420);
    statusEl.textContent = item.status;
    statusEl.style.transition = 'opacity .3s ease';
    statusEl.style.opacity = 1;

    await wait(2200);
    i++;
  }
}
runVerifyLoop();
