/* ==========================================================================
   2048 CupCakes - Footer Component
   ========================================================================== */

(function () {
  const year = new Date().getFullYear();

  const footerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-inner">
          <div class="footer-col">
            <h3>🧁 2048 CupCakes</h3>
            <p style="max-width:280px; font-size:0.9rem; color:#fdeee2;">
              A sweet, free, browser-based twist on the classic 2048 sliding tile puzzle game. Merge cupcakes, beat your best score, and have fun.
            </p>
          </div>
          <div class="footer-col">
            <h3>Game</h3>
            <a href="#game">Play 2048 CupCakes</a>
            <a href="#" class="footer-how">How to Play</a>
            <a href="#" class="footer-tips">Tips &amp; Strategies</a>
          </div>
          <div class="footer-col">
            <h3>Info</h3>
            <a href="#" class="footer-about">About</a>
            <a href="#" class="footer-faq">FAQ</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${year} 2048 CupCakes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;

  const footerContainer = document.getElementById('site-footer');
  if (footerContainer) {
    footerContainer.innerHTML = footerHTML;
  }

  function scrollToSectionByHeading(keyword) {
    const headings = document.querySelectorAll('main h2');
    for (const heading of headings) {
      if (heading.textContent.toLowerCase().includes(keyword.toLowerCase())) {
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
  }

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('footer-how')) {
      e.preventDefault();
      scrollToSectionByHeading('How to Play');
    } else if (e.target.classList.contains('footer-about')) {
      e.preventDefault();
      scrollToSectionByHeading('About 2048');
    } else if (e.target.classList.contains('footer-faq')) {
      e.preventDefault();
      scrollToSectionByHeading('Frequently Asked');
    } else if (e.target.classList.contains('footer-tips')) {
      e.preventDefault();
      scrollToSectionByHeading('Tips and Strategies');
    }
  });
})();
