// ══════════════════════════════════════
//  CUSTOM CURSOR
// ══════════════════════════════════════
const cur  = document.getElementById('cur');
const ring = document.getElementById('cur-r');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

(function loop() {
  rx += (mx - rx) * .1;
  ry += (my - ry) * .1;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(loop);
})();

// ══════════════════════════════════════
//  STICKY NAV
// ══════════════════════════════════════
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('solid', scrollY > 40);
});

// ══════════════════════════════════════
//  MOBILE NAV
// ══════════════════════════════════════
function toggleNav() {
  document.getElementById('nl').classList.toggle('open');
}
function closeNav() {
  document.getElementById('nl').classList.remove('open');
}

// ══════════════════════════════════════
//  SCROLL REVEAL
// ══════════════════════════════════════
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('on');

    // stagger children
    if (e.target.classList.contains('sg')) {
      [...e.target.children].forEach((child, i) => {
        setTimeout(() => child.classList.add('on'), i * 80);
      });
    }

    // skill bars
    e.target.querySelectorAll('.sk-fill').forEach(bar => {
      bar.style.width = bar.dataset.w + '%';
    });
  });
}, { threshold: .1 });

document.querySelectorAll('.r, .sg').forEach(el => revealObs.observe(el));

// ══════════════════════════════════════
//  CONTACT FORM — Formspree
//  Cara setup:
//  1. Daftar gratis di https://formspree.io
//  2. Buat form baru → dapat kode unik (contoh: xkgwabcd)
//  3. Ganti "YOUR_FORM_ID" di index.html dengan kode itu
//     contoh: action="https://formspree.io/f/xkgwabcd"
//  4. Verifikasi email pasyaawanr@gmail.com di Formspree
//  5. Selesai! Pesan langsung masuk ke email kamu
// ══════════════════════════════════════
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // UI loading state
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled    = true;
    submitBtn.style.opacity = '.7';
    formStatus.textContent  = '';
    formStatus.className    = 'form-status';

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // Sukses
        submitBtn.textContent = '✓ Pesan Terkirim!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        submitBtn.style.opacity = '1';
        formStatus.textContent = '🎉 Pesan berhasil dikirim ke pasyaawanr@gmail.com!';
        formStatus.className = 'form-status success';
        form.reset();

        setTimeout(() => {
          submitBtn.textContent = 'Kirim Pesan →';
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          formStatus.textContent = '';
        }, 5000);

      } else {
        throw new Error('Server error');
      }

    } catch (err) {
      // Error — fallback ke mailto
      submitBtn.textContent  = 'Kirim Pesan →';
      submitBtn.disabled     = false;
      submitBtn.style.opacity = '1';

      const name    = data.get('name')    || '';
      const email   = data.get('email')   || '';
      const message = data.get('message') || '';
      const subject = encodeURIComponent('Pesan dari Portfolio - ' + name);
      const body    = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`);

      // Buka mailto sebagai fallback
      window.location.href = `mailto:pasyaawanr@gmail.com?subject=${subject}&body=${body}`;

      formStatus.textContent = '💡 Membuka email client kamu sebagai alternatif...';
      formStatus.className   = 'form-status';
    }
  });
}

// ══════════════════════════════════════
//  SMOOTH ACTIVE NAV HIGHLIGHT
// ══════════════════════════════════════
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + e.target.id) {
          a.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: .5 });

sections.forEach(s => navObs.observe(s));
