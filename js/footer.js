// footer.js - 2048 Cupcakes site footer component
(function () {
  const year = new Date().getFullYear();

  const footerHTML = `
    <footer class="site-footer">
      <div class="site-footer-inner">
        <div class="footer-brand">
          <span class="brand-icon" aria-hidden="true">🧁</span>
          <span class="brand-name">2048 Cupcakes</span>
          <p>A sweet, free twist on the classic 2048 sliding tile puzzle game. Merge cupcakes, beat your best score, and bake your way to the 2048 Royal Cupcake.</p>
        </div>

        <div class="footer-links">
          <h4>Game</h4>
          <a href="/#game">Play 2048 Cupcakes</a>
          <a href="/#how-to-play">How To Play</a>
          <a href="/#flavor-guide">Cupcake Tile Guide</a>
          <a href="/#tips">Tips &amp; Strategies</a>
        </div>

        <div class="footer-links">
          <h4>Info</h4>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="/cookies">Cookies Policy</a>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; ${year} 2048 Cupcakes Game.</p>
        <p>2048 Cupcakes is an independent fan-made puzzle game and is not affiliated with any official 2048 brand.</p>
      </div>
    </footer>
  `;

  const placeholder = document.getElementById('footer-placeholder');
  if (placeholder) {
    placeholder.outerHTML = footerHTML;
  }
})();
