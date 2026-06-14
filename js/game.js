/* ==========================================================================
   2048 CupCakes - Game Logic
   ========================================================================== */

(function () {
  const SIZE = 4;
  const STORAGE_BEST_KEY = 'cupcakes2048_best';

  // Map tile values to cupcake image filenames.
  // Add your cupcake images to the /images/ folder with these exact names.
  const TILE_IMAGES = {
    2: 'images/cupcake-2.png',
    4: 'images/cupcake-4.png',
    8: 'images/cupcake-8.png',
    16: 'images/cupcake-16.png',
    32: 'images/cupcake-32.png',
    64: 'images/cupcake-64.png',
    128: 'images/cupcake-128.png',
    256: 'images/cupcake-256.png',
    512: 'images/cupcake-512.png',
    1024: 'images/cupcake-1024.png',
    2048: 'images/cupcake-2048.png',
    4096: 'images/cupcake-super.png'
  };

  let board = [];
  let score = 0;
  let best = 0;
  let hasWon = false;
  let isGameOver = false;
  let isAnimating = false;

  const boardEl = document.getElementById('game-board');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best-score');
  const messageEl = document.getElementById('game-message');
  const messageTextEl = document.getElementById('game-message-text');
  const restartBtn = document.getElementById('message-restart-btn');
  const newGameBtn = document.getElementById('new-game-btn');

  /* ------------------------------------------------------------------ */
  /* Initialization                                                       */
  /* ------------------------------------------------------------------ */

  function init() {
    board = [];
    for (let r = 0; r < SIZE; r++) {
      board.push(new Array(SIZE).fill(0));
    }
    score = 0;
    hasWon = false;
    isGameOver = false;

    best = parseInt(localStorage.getItem(STORAGE_BEST_KEY), 10) || 0;

    addRandomTile();
    addRandomTile();

    hideMessage();
    updateScoreDisplay();
    render();
  }

  function addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }
    if (emptyCells.length === 0) return;

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                            */
  /* ------------------------------------------------------------------ */

  function render() {
    boardEl.innerHTML = '';

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const value = board[r][c];
        const cell = document.createElement('div');
        cell.className = 'cell';

        if (value !== 0) {
          const tile = document.createElement('div');
          const tileClass = TILE_IMAGES[value] ? `tile-${value}` : 'tile-super';
          tile.className = `tile ${tileClass}`;

          const imgSrc = TILE_IMAGES[value] || TILE_IMAGES[4096];
          const img = document.createElement('img');
          img.src = imgSrc;
          img.alt = `${value} CupCake`;
          img.loading = 'lazy';
          img.onerror = function () {
            // Fallback to showing the number if image is missing
            tile.removeChild(img);
            const span = document.createElement('span');
            span.textContent = value;
            tile.appendChild(span);
          };

          tile.appendChild(img);
          cell.appendChild(tile);
        }

        boardEl.appendChild(cell);
      }
    }
  }

  function updateScoreDisplay() {
    scoreEl.textContent = score;
    if (score > best) {
      best = score;
      localStorage.setItem(STORAGE_BEST_KEY, best);
    }
    bestEl.textContent = best;
  }

  /* ------------------------------------------------------------------ */
  /* Movement logic                                                       */
  /* ------------------------------------------------------------------ */

  // Slide and merge a single row to the left. Returns { row, gained, moved }
  function slideRowLeft(row) {
    const filtered = row.filter(v => v !== 0);
    const result = [];
    let gained = 0;

    for (let i = 0; i < filtered.length; i++) {
      const current = filtered[i];
      const next = filtered[i + 1];

      if (current === next) {
        const merged = current * 2;
        result.push(merged);
        gained += merged;
        i++; // skip the next one, it has been merged
      } else {
        result.push(current);
      }
    }

    while (result.length < SIZE) {
      result.push(0);
    }

    let moved = false;
    for (let i = 0; i < SIZE; i++) {
      if (result[i] !== row[i]) {
        moved = true;
        break;
      }
    }

    return { row: result, gained, moved };
  }

  function cloneBoard(b) {
    return b.map(row => row.slice());
  }

  function transpose(b) {
    const result = [];
    for (let c = 0; c < SIZE; c++) {
      const newRow = [];
      for (let r = 0; r < SIZE; r++) {
        newRow.push(b[r][c]);
      }
      result.push(newRow);
    }
    return result;
  }

  function reverseRows(b) {
    return b.map(row => row.slice().reverse());
  }

  function move(direction) {
    if (isAnimating || isGameOver) return;

    let working = cloneBoard(board);
    let totalGained = 0;
    let anyMoved = false;

    if (direction === 'left' || direction === 'right') {
      if (direction === 'right') working = reverseRows(working);

      for (let r = 0; r < SIZE; r++) {
        const { row, gained, moved } = slideRowLeft(working[r]);
        working[r] = row;
        totalGained += gained;
        if (moved) anyMoved = true;
      }

      if (direction === 'right') working = reverseRows(working);
    } else if (direction === 'up' || direction === 'down') {
      working = transpose(working);
      if (direction === 'down') working = reverseRows(working);

      for (let r = 0; r < SIZE; r++) {
        const { row, gained, moved } = slideRowLeft(working[r]);
        working[r] = row;
        totalGained += gained;
        if (moved) anyMoved = true;
      }

      if (direction === 'down') working = reverseRows(working);
      working = transpose(working);
    }

    if (!anyMoved) return;

    board = working;
    score += totalGained;
    updateScoreDisplay();
    addRandomTile();
    render();

    checkWin();
    checkGameOver();
  }

  /* ------------------------------------------------------------------ */
  /* Win / Game Over checks                                               */
  /* ------------------------------------------------------------------ */

  function checkWin() {
    if (hasWon) return;

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[r][c] >= 2048) {
          hasWon = true;
          showWinMessage();
          launchConfetti();
          return;
        }
      }
    }
  }

  function boardsEqual(a, b) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (a[r][c] !== b[r][c]) return false;
      }
    }
    return true;
  }

  function hasAvailableMoves() {
    // Empty cell check
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[r][c] === 0) return true;
      }
    }

    // Check for any possible merge in any direction
    const directions = ['left', 'right', 'up', 'down'];
    for (const dir of directions) {
      let working = cloneBoard(board);

      if (dir === 'left' || dir === 'right') {
        if (dir === 'right') working = reverseRows(working);
        for (let r = 0; r < SIZE; r++) {
          const { moved } = slideRowLeft(working[r]);
          if (moved) return true;
        }
      } else {
        working = transpose(working);
        if (dir === 'down') working = reverseRows(working);
        for (let r = 0; r < SIZE; r++) {
          const { moved } = slideRowLeft(working[r]);
          if (moved) return true;
        }
      }
    }

    return false;
  }

  function checkGameOver() {
    if (!hasAvailableMoves()) {
      isGameOver = true;
      showGameOverMessage();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Messages                                                             */
  /* ------------------------------------------------------------------ */

  function hideMessage() {
    messageEl.classList.add('hidden');
    messageEl.innerHTML = '';
  }

  function showGameOverMessage() {
    messageEl.innerHTML = `
      <p>Game Over! No more moves left.</p>
      <button id="message-restart-btn" class="btn btn-primary">Try Again</button>
    `;
    messageEl.classList.remove('hidden');
    document.getElementById('message-restart-btn').addEventListener('click', init);
  }

  function showWinMessage() {
    messageEl.innerHTML = `
      <p>You baked the 2048 CupCake! 🎉</p>
      <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
        <button id="keep-playing-btn" class="btn btn-secondary">Keep Playing</button>
        <button id="message-restart-btn" class="btn btn-primary">New Game</button>
      </div>
    `;
    messageEl.classList.remove('hidden');

    document.getElementById('message-restart-btn').addEventListener('click', init);
    document.getElementById('keep-playing-btn').addEventListener('click', hideMessage);
  }

  /* ------------------------------------------------------------------ */
  /* Controls                                                             */
  /* ------------------------------------------------------------------ */

  const KEY_MAP = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
    a: 'left',
    d: 'right',
    w: 'up',
    s: 'down'
  };

  document.addEventListener('keydown', function (e) {
    const dir = KEY_MAP[e.key];
    if (dir) {
      e.preventDefault();
      move(dir);
    }
  });

  // Touch / swipe controls
  let touchStartX = 0;
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 30;

  if (boardEl) {
    boardEl.addEventListener('touchstart', function (e) {
      const touch = e.changedTouches[0];
      touchStartX = touch.screenX;
      touchStartY = touch.screenY;
    }, { passive: true });

    boardEl.addEventListener('touchend', function (e) {
      const touch = e.changedTouches[0];
      const dx = touch.screenX - touchStartX;
      const dy = touch.screenY - touchStartY;

      if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        move(dx > 0 ? 'right' : 'left');
      } else {
        move(dy > 0 ? 'down' : 'up');
      }
    }, { passive: true });
  }

  // On-screen directional buttons
  document.querySelectorAll('.touch-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const dir = btn.getAttribute('data-dir');
      if (dir) move(dir);
    });
  });

  // New game buttons
  if (newGameBtn) newGameBtn.addEventListener('click', init);
  if (restartBtn) restartBtn.addEventListener('click', init);

  /* ------------------------------------------------------------------ */
  /* Confetti celebration                                                 */
  /* ------------------------------------------------------------------ */

  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    const colors = ['#ff6fa5', '#ffc6dd', '#a78bfa', '#ffb085', '#ffe0ec', '#ff9bb3'];
    const pieces = [];
    const PIECE_COUNT = 150;

    for (let i = 0; i < PIECE_COUNT; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.5,
        size: 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: 2 + Math.random() * 4,
        speedX: -2 + Math.random() * 4,
        rotation: Math.random() * 360,
        rotationSpeed: -6 + Math.random() * 12
      });
    }

    let frame = 0;
    const MAX_FRAMES = 220;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();

        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
      });

      frame++;

      if (frame < MAX_FRAMES) {
        requestAnimationFrame(draw);
      } else {
        canvas.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    draw();
  }

  /* ------------------------------------------------------------------ */
  /* Start                                                                */
  /* ------------------------------------------------------------------ */

  init();
})();
