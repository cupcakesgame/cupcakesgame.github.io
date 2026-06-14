/* header.js — injects sticky header with mobile nav */
(function () {
  const html = `
<header id="site-header">
  <div class="container">
    <div class="header-inner">
      <a href="/" class="logo" aria-label="2048 CupCakes Home">
        <span class="logo-icon">🧁</span>
        <span>2048 <span>CupCakes</span></span>
      </a>
      <nav class="main-nav" aria-label="Main navigation">
        <a href="#game">Play Now</a>
        <a href="#how-to-play">How to Play</a>
        <a href="#tiles">Cupcake Tiles</a>
        <a href="#tips">Tips</a>
        <a href="#faq">FAQ</a>
      </nav>
      <a href="#game" class="btn btn-primary nav-cta">🎮 Play Free</a>
      <button class="hamburger" aria-label="Toggle menu" aria-expanded="false" id="hamburger-btn">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
    <a href="#game">🎮 Play Now</a>
    <a href="#how-to-play">📖 How to Play</a>
    <a href="#tiles">🧁 Cupcake Tiles</a>
    <a href="#tips">💡 Tips & Tricks</a>
    <a href="#faq">❓ FAQ</a>
  </nav>
</header>`;

  const placeholder = document.getElementById('header-placeholder');
  if (placeholder) {
    placeholder.outerHTML = html;
  } else {
    document.body.insertAdjacentHTML('afterbegin', html);
  }

  /* Scroll shadow */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* Hamburger toggle */
  const btn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  /* Close mobile nav on link click */
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      mobileNav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();
