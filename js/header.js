// header.js - 2048 Cupcakes site header component
(function () {
  const headerHTML = `
    <header class="site-header">
      <div class="site-header-inner">
        <a class="brand" href="/" aria-label="2048 Cupcakes home">
          <span class="brand-icon" aria-hidden="true">🧁</span>
          <span class="brand-name">2048 Cupcakes</span>
        </a>

        <nav class="site-nav" id="site-nav">
          <a href="/#game">Play</a>
          <a href="/#how-to-play">How To Play</a>
          <a href="/#about">About</a>
          <a href="/#features">Features</a>
          <a href="/#flavor-guide">Tile Guide</a>
          <a href="/#tips">Tips</a>
          <a href="/#faq">FAQ</a>
        </nav>

        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  `;

  const placeholder = document.getElementById('header-placeholder');
  if (placeholder) {
    placeholder.outerHTML = headerHTML;
  }

  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();
