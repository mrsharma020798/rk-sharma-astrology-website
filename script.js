// ---------- Language handling ----------
const langToggle = document.getElementById('langToggle');
const htmlRoot = document.getElementById('htmlRoot');
const metaDesc = document.getElementById('metaDesc');

function getSavedLang() {
    try {
        const saved = localStorage.getItem('site-lang');
        if (saved) return saved;

        const browserLang = navigator.language || navigator.userLanguage || '';

        return browserLang.toLowerCase().startsWith('hi') ? 'hi' : 'en';
    } catch (e) {
        return 'en';
    }
}

function saveLang(lang) {
  try {
    localStorage.setItem('site-lang', lang);
  } catch (e) { /* ignore if storage unavailable */ }
}

function applyLanguage(lang) {
  const dict = translations[lang] || translations.hi;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = dict[key];
    if (value === undefined) return;
    if (HTML_KEYS.includes(key)) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
  });

  if (metaDesc && dict['meta.description']) {
    metaDesc.setAttribute('content', dict['meta.description']);
  }

  htmlRoot.setAttribute('lang', lang === 'hi' ? 'hi' : 'en');
  langToggle.textContent = lang === 'hi' ? 'EN' : 'हिं';
  langToggle.setAttribute('aria-label', lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें');

  document.body.dataset.lang = lang;
  saveLang(lang);
}

let currentLang = getSavedLang();
applyLanguage(currentLang);

langToggle?.addEventListener('click', () => {
  currentLang = currentLang === 'hi' ? 'en' : 'hi';
  applyLanguage(currentLang);
});

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---------- Build the kundli chakra (12-house zodiac wheel) ----------
const zodiacGlyphs = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const spokesGroup = document.getElementById('spokes');
const glyphsGroup = document.getElementById('glyphs');

if (spokesGroup && glyphsGroup) {
  const cx = 200, cy = 200, rOuter = 188, rMid = 150, rGlyph = 168;
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const x1 = cx + rMid * Math.cos(angle);
    const y1 = cy + rMid * Math.sin(angle);
    const x2 = cx + rOuter * Math.cos(angle);
    const y2 = cy + rOuter * Math.sin(angle);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    spokesGroup.appendChild(line);

    const midAngle = ((i * 30 + 15) - 90) * (Math.PI / 180);
    const gx = cx + rGlyph * Math.cos(midAngle);
    const gy = cy + rGlyph * Math.sin(midAngle);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', gx);
    text.setAttribute('y', gy);
    text.textContent = zodiacGlyphs[i];
    glyphsGroup.appendChild(text);
  }
}

// ---------- Contact form submission ----------
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const dict = translations[currentLang] || translations.hi;
  statusEl.textContent = '';
  statusEl.className = 'form-status';

  const data = {
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    service: document.getElementById('service').value,
    message: document.getElementById('message').value.trim(),
  };

  if (!data.name || !data.phone) {
    statusEl.textContent = dict['form.errRequired'];
    statusEl.className = 'form-status err';
    return;
  }
  if (!/^\d{10}$/.test(data.phone)) {
    statusEl.textContent = dict['form.errPhone'];
    statusEl.className = 'form-status err';
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = dict['form.sending'];

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, lang: currentLang }),
    });
    const result = await res.json();

    if (res.ok && result.success) {
      statusEl.textContent = dict['form.success'];
      statusEl.className = 'form-status ok';
      form.reset();
    } else {
      throw new Error(result.error || 'error');
    }
  } catch (err) {
    statusEl.textContent = dict['form.errServer'];
    statusEl.className = 'form-status err';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = dict['form.submit'];
  }
});
