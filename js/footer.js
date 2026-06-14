/* footer.js — injects site footer */
(function () {
  const year = new Date().getFullYear();
  const html = `
<footer id="site-footer" aria-label="Site footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="/" class="logo" aria-label="2048 CupCakes Home">
          <span class="logo-icon" aria-hidden="true">🧁</span>
          <span>2048 <span>CupCakes</span></span>
        </a>
        <p>Merge sweet cupcake tiles and bake your way to the legendary 2048 CupCakes tile. Free to play, no download required.</p>
      </div>
      <div class="footer-col">
        <h4>Play</h4>
        <ul>
          <li><a href="#game">Start Game</a></li>
          <li><a href="#how-to-play">How to Play</a></li>
          <li><a href="#tiles">Cupcake Tiles</a></li>
          <li><a href="#tips">Strategies</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Learn</h4>
        <ul>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#about">About the Game</a></li>
          <li><a href="#features">Game Features</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <ul>
          <li><a href="/privacy.html">Privacy Policy</a></li>
          <li><a href="/terms.html">Terms of Use</a></li>
          <li><a href="/contact.html">Contact Us</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${year} <a href="/">2048 CupCakes</a>. All rights reserved. Made with 🧁 for puzzle lovers.</p>
      <div class="footer-links-bottom">
        <a href="/privacy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
        <a href="/contact.html">Contact</a>
      </div>
    </div>
  </div>
</footer>`;

  const placeholder = document.getElementById('footer-placeholder');
  if (placeholder) {
    placeholder.outerHTML = html;
  } else {
    document.body.insertAdjacentHTML('beforeend', html);
  }
})();
