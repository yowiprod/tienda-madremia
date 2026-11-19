// Header scroll shadow
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Order form
function handleOrder(e) {
  e.preventDefault();
  document.getElementById('orderForm').style.display = 'none';
  document.getElementById('orderSuccess').style.display = 'block';
  document.querySelector('.order-note').style.display = 'none';
  window.scrollTo({ top: document.getElementById('pedir').offsetTop - 80, behavior: 'smooth' });
}
