/* ==========================================================================
   2048 CupCakes - Header Component
   ========================================================================== */

(function () {
  const headerHTML = `
    <header class="site-header">
      <div class="container">
        <a href="#" class="site-logo">
          <span class="emoji">🧁</span>
          <span>2048 CupCakes</span>
        </a>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">☰</button>
        <nav class="site-nav" id="site-nav">
          <a href="#game">Play</a>
          <a href="#" class="nav-how">How to Play</a>
          <a href="#" class="nav-about">About</a>
          <a href="#" class="nav-faq">FAQ</a>
        </nav>
      </div>
    </header>
  `;

  const headerContainer = document.getElementById('site-header');
  if (headerContainer) {
    headerContainer.innerHTML = headerHTML;
  }

  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Smooth-scroll helper links to specific sections by heading text
  function scrollToSectionByHeading(keyword) {
    const headings = document.querySelectorAll('main h2');
    for (const heading of headings) {
      if (heading.textContent.toLowerCase().includes(keyword.toLowerCase())) {
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (nav) nav.classList.remove('open');
        return;
      }
    }
  }

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav-how')) {
      e.preventDefault();
      scrollToSectionByHeading('How to Play');
    } else if (e.target.classList.contains('nav-about')) {
      e.preventDefault();
      scrollToSectionByHeading('About 2048');
    } else if (e.target.classList.contains('nav-faq')) {
      e.preventDefault();
      scrollToSectionByHeading('Frequently Asked');
    }
  });
})();
