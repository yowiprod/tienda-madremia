/* TU RINCÓN — Main JS */

// Announcement bar close
const bar = document.querySelector('.announcement-bar');
document.querySelector('.announcement-close')?.addEventListener('click', () => {
  bar.style.display = 'none';
  document.documentElement.style.setProperty('--bar-h', '0px');
});

// Sticky header shadow on scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile menu
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const overlay = document.getElementById('overlay');

function openMenu() {
  mobileMenu.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMenu);
mobileClose?.addEventListener('click', closeMenu);
overlay?.addEventListener('click', closeMenu);

// Animate elements on scroll (Intersection Observer)
const animItems = document.querySelectorAll(
  '.product-card, .journal-card, .category-item, .tagline, .split-text, .split-image'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

animItems.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Newsletter form feedback
document.querySelector('.newsletter-form')?.addEventListener('submit', e => {
  const btn = e.target.querySelector('button');
  btn.textContent = '¡Listo! ✓';
  btn.style.background = '#c9a98e';
  setTimeout(() => {
    btn.textContent = 'UNIRSE';
    btn.style.background = '';
  }, 3000);
});
