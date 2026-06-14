// game.js - 2048 Cupcakes game engine
(function () {
  'use strict';

  /* =========================================================
     Cupcake tile artwork mapping
     Add your own images to the /images folder using these
     exact file names, or update the paths below.
     ========================================================= */
  const CUPCAKE_IMAGES = {
    2: 'img/2.jpg',
    4: 'img/4.jpg',
    8: 'img/8.jpg',
    16: 'img/16.jpg',
    32: 'img/32.jpg',
    64: 'img/64.jpg',
    128: 'img/128.jpg',
    256: 'img/256.jpg',
    512: 'img/512.jpg',
    1024: 'img/1024.jpg',
    2048: 'img/2048.jpg'
  };
  const SUPER_CUPCAKE_IMAGE = 'images/cupcake-super.png';

  const CUPCAKE_NAMES = {
    2: 'Vanilla Cupcake',
    4: 'Strawberry Cupcake',
    8: 'Chocolate Cupcake',
    16: 'Blueberry Cupcake',
    32: 'Red Velvet Cupcake',
    64: 'Lemon Cupcake',
    128: 'Mint Cupcake',
    256: 'Caramel Cupcake',
    512: 'Rainbow Cupcake',
    1024: 'Golden Cupcake',
    2048: 'Royal Cupcake'
  };

  function imageFor(value) {
    return CUPCAKE_IMAGES[value] || SUPER_CUPCAKE_IMAGE;
  }

  function nameFor(value) {
    return CUPCAKE_NAMES[value] || 'Super Cupcake';
  }

  /* =========================================================
     Grid + Tile model (classic 2048 grid manager pattern)
     ========================================================= */

  const SIZE = 4;
  let tileIdCounter = 1;

  class Tile {
    constructor(position, value) {
      this.id = tileIdCounter++;
      this.x = position.x;
      this.y = position.y;
      this.value = value;
      this.previousPosition = null;
      this.mergedFrom = null; // tracks tiles merged together to form this one
    }
    savePosition() {
      this.previousPosition = { x: this.x, y: this.y };
    }
    updatePosition(position) {
      this.x = position.x;
      this.y = position.y;
    }
  }

  class Grid {
    constructor(size) {
      this.size = size;
      this.cells = this.empty();
    }
    empty() {
      const cells = [];
      for (let x = 0; x < this.size; x++) {
        const row = [];
        for (let y = 0; y < this.size; y++) {
          row.push(null);
        }
        cells.push(row);
      }
      return cells;
    }
    randomAvailableCell() {
      const cells = this.availableCells();
      if (cells.length) {
        return cells[Math.floor(Math.random() * cells.length)];
      }
      return null;
    }
    availableCells() {
      const cells = [];
      this.eachCell((x, y, tile) => {
        if (!tile) cells.push({ x, y });
      });
      return cells;
    }
    eachCell(callback) {
      for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
          callback(x, y, this.cells[x][y]);
        }
      }
    }
    cellsAvailable() {
      return !!this.availableCells().length;
    }
    cellAvailable(cell) {
      return !this.cellOccupied(cell);
    }
    cellOccupied(cell) {
      return !!this.cellContent(cell);
    }
    cellContent(cell) {
      if (this.withinBounds(cell)) {
        return this.cells[cell.x][cell.y];
      }
      return null;
    }
    insertTile(tile) {
      this.cells[tile.x][tile.y] = tile;
    }
    removeTile(tile) {
      this.cells[tile.x][tile.y] = null;
    }
    withinBounds(position) {
      return position.x >= 0 && position.x < this.size &&
             position.y >= 0 && position.y < this.size;
    }
  }

  /* =========================================================
     Game manager
     ========================================================= */

  class GameManager {
    constructor() {
      this.size = SIZE;
      this.storageKey = 'cupcakes2048-best';
      this.history = [];
      this.maxHistory = 12;
      this.startTiles = 2;

      this.boardGrid = document.getElementById('board-grid');
      this.boardTiles = document.getElementById('board-tiles');
      this.scoreEl = document.getElementById('score');
      this.bestEl = document.getElementById('best-score');
      this.overlayEl = document.getElementById('game-overlay');
      this.overlayTitle = document.getElementById('overlay-title');
      this.overlayText = document.getElementById('overlay-text');
      this.overlayBtn = document.getElementById('overlay-btn');
      this.newGameBtn = document.getElementById('new-game-btn');
      this.undoBtn = document.getElementById('undo-btn');

      this.buildGridCells();
      this.bindEvents();
      this.setup();
    }

    buildGridCells() {
      this.boardGrid.innerHTML = '';
      for (let i = 0; i < this.size * this.size; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        this.boardGrid.appendChild(cell);
      }
    }

    bindEvents() {
      // Keyboard
      document.addEventListener('keydown', (e) => {
        const map = {
          ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3,
          w: 0, d: 1, s: 2, a: 3, W: 0, D: 1, S: 2, A: 3
        };
        if (map.hasOwnProperty(e.key)) {
          e.preventDefault();
          this.move(map[e.key]);
        }
      });

      // Touch swipe
      let touchStartX = 0;
      let touchStartY = 0;
      const boardContainer = document.querySelector('.board-container');

      boardContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      boardContainer.addEventListener('touchend', (e) => {
        if (!e.changedTouches.length) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        const threshold = 24;

        if (Math.max(absX, absY) < threshold) return;

        if (absX > absY) {
          this.move(dx > 0 ? 1 : 3); // right : left
        } else {
          this.move(dy > 0 ? 2 : 0); // down : up
        }
      }, { passive: true });

      // On-screen d-pad
      document.querySelectorAll('.dpad-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const dirMap = { up: 0, right: 1, down: 2, left: 3 };
          this.move(dirMap[btn.dataset.dir]);
        });
      });

      // New game / undo / overlay
      this.newGameBtn.addEventListener('click', () => this.restart());
      this.overlayBtn.addEventListener('click', () => this.handleOverlayClick());
      this.undoBtn.addEventListener('click', () => this.undo());

      // Resize - keep tile positions correct on orientation change
      window.addEventListener('resize', () => this.actuate());
    }

    /* ---------------- Setup / lifecycle ---------------- */

    setup() {
      this.grid = new Grid(this.size);
      this.score = 0;
      this.over = false;
      this.won = false;
      this.keepPlaying = false;
      this.hasShownWin = false; // NEW: Track if we've already shown the win overlay
      this.history = [];
      this.bestScore = Number(localStorage.getItem(this.storageKey)) || 0;

      this.addStartTiles();
      this.actuate();
      this.hideOverlay();
      this.updateUndoState();
    }

    restart() {
      this.setup();
    }

    handleOverlayClick() {
      if (this.won && !this.keepPlaying) {
        // This is the "Keep Playing" click after winning
        this.keepPlaying = true;
        this.won = false; // Reset won state so moves work again
        this.hideOverlay();
      } else if (this.over) {
        // This is the "Try Again" click after game over
        this.restart();
      } else {
        // Default fallback
        this.continueGame();
      }
    }

    continueGame() {
      this.keepPlaying = true;
      this.won = false;
      this.hideOverlay();
    }

    addStartTiles() {
      for (let i = 0; i < this.startTiles; i++) {
        this.addRandomTile();
      }
    }

    addRandomTile() {
      if (this.grid.cellsAvailable()) {
        const value = Math.random() < 0.9 ? 2 : 4;
        const tile = new Tile(this.grid.randomAvailableCell(), value);
        this.grid.insertTile(tile);
      }
    }

    /* ---------------- Serialization for undo ---------------- */

    serialize() {
      const cells = [];
      this.grid.eachCell((x, y, tile) => {
        cells.push(tile ? { x, y, value: tile.value } : null);
      });
      return { cells, score: this.score, won: this.won, over: this.over, keepPlaying: this.keepPlaying };
    }

    pushHistory() {
      this.history.push(this.serialize());
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }
      this.updateUndoState();
    }

    undo() {
      if (!this.history.length) return;
      const state = this.history.pop();

      this.grid = new Grid(this.size);
      state.cells.forEach((cell) => {
        if (cell) {
          const tile = new Tile({ x: cell.x, y: cell.y }, cell.value);
          this.grid.insertTile(tile);
        }
      });
      this.score = state.score;
      this.won = state.won || false;
      this.over = state.over || false;
      this.keepPlaying = state.keepPlaying || false;
      this.hideOverlay();
      this.actuate();
      this.updateUndoState();
    }

    updateUndoState() {
      this.undoBtn.disabled = this.history.length === 0;
      this.undoBtn.style.opacity = this.history.length === 0 ? '0.5' : '1';
    }

    /* ---------------- Movement ---------------- */

    move(direction) {
      // FIX: Better condition - don't allow moves if game over, or if won and not continuing
      if (this.over) return;
      if (this.won && !this.keepPlaying) return;

      const vector = this.getVector(direction);
      const traversals = this.buildTraversals(vector);
      let moved = false;

      // Save previous positions, clear merge info
      this.prepareTiles();

      const previousState = this.serialize();

      traversals.x.forEach((x) => {
        traversals.y.forEach((y) => {
          const cell = { x, y };
          const tile = this.grid.cellContent(cell);

          if (tile) {
            const positions = this.findFarthestPosition(cell, vector);
            const next = this.grid.cellContent(positions.next);

            if (next && next.value === tile.value && !next.mergedFrom) {
              const merged = new Tile(positions.next, tile.value * 2);
              merged.mergedFrom = [tile, next];

              this.grid.insertTile(merged);
              this.grid.removeTile(tile);

              tile.updatePosition(positions.next);

              this.score += merged.value;

              // FIX: Only trigger win when exactly reaching 2048, and only once
              if (merged.value === 2048 && !this.won && !this.hasShownWin) {
                this.won = true;
                this.hasShownWin = true;
              }
            } else {
              this.moveTile(tile, positions.farthest);
            }

            if (!this.positionsEqual(cell, tile)) {
              moved = true;
            }
          }
        });
      });

      if (moved) {
        this.history.push(previousState);
        if (this.history.length > this.maxHistory) this.history.shift();
        this.updateUndoState();

        this.addRandomTile();

        if (!this.movesAvailable()) {
          this.over = true;
        }

        this.actuate();

        // FIX: Only show win overlay once and only when appropriate
        if (this.won && !this.keepPlaying && !this.hasShownWin) {
          this.hasShownWin = true;
          this.showOverlay('win');
        } else if (this.over) {
          this.showOverlay('over');
        }
      }
    }

    getVector(direction) {
      const map = {
        0: { x: 0, y: -1 }, // up
        1: { x: 1, y: 0 },  // right
        2: { x: 0, y: 1 },  // down
        3: { x: -1, y: 0 }  // left
      };
      return map[direction];
    }

    buildTraversals(vector) {
      const traversals = { x: [], y: [] };
      for (let pos = 0; pos < this.size; pos++) {
        traversals.x.push(pos);
        traversals.y.push(pos);
      }
      if (vector.x === 1) traversals.x = traversals.x.reverse();
      if (vector.y === 1) traversals.y = traversals.y.reverse();
      return traversals;
    }

    findFarthestPosition(cell, vector) {
      let previous;
      let next = cell;
      do {
        previous = next;
        next = { x: previous.x + vector.x, y: previous.y + vector.y };
      } while (this.grid.withinBounds(next) && this.grid.cellAvailable(next));

      return { farthest: previous, next };
    }

    moveTile(tile, cell) {
      this.grid.cells[tile.x][tile.y] = null;
      this.grid.cells[cell.x][cell.y] = tile;
      tile.updatePosition(cell);
    }

    prepareTiles() {
      this.grid.eachCell((x, y, tile) => {
        if (tile) {
          tile.mergedFrom = null;
          tile.savePosition();
        }
      });
    }

    positionsEqual(first, second) {
      return first.x === second.x && first.y === second.y;
    }

    movesAvailable() {
      return this.grid.cellsAvailable() || this.tileMatchesAvailable();
    }

    tileMatchesAvailable() {
      let matches = false;
      for (let x = 0; x < this.size && !matches; x++) {
        for (let y = 0; y < this.size && !matches; y++) {
          const tile = this.grid.cellContent({ x, y });
          if (tile) {
            for (let d = 0; d < 4; d++) {
              const vector = this.getVector(d);
              const cell = { x: x + vector.x, y: y + vector.y };
              const other = this.grid.cellContent(cell);
              if (other && other.value === tile.value) {
                matches = true;
              }
            }
          }
        }
      }
      return matches;
    }

    /* ---------------- Rendering ---------------- */

    actuate() {
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        localStorage.setItem(this.storageKey, String(this.bestScore));
      }

      this.scoreEl.textContent = this.score;
      this.bestEl.textContent = this.bestScore;

      this.renderTiles();
    }

    getCellMetrics() {
      const rect = this.boardTiles.getBoundingClientRect();
      const gapRatio = 0.035; // matches board-grid CSS gap of 3.5%
      const gap = rect.width * gapRatio;
      const cellSize = (rect.width - gap * (this.size - 1)) / this.size;
      return { cellSize, gap };
    }

    renderTiles() {
      this.boardTiles.innerHTML = '';
      const { cellSize, gap } = this.getCellMetrics();

      this.grid.eachCell((x, y, tile) => {
        if (!tile) return;
        this.renderTile(tile, cellSize, gap);

        if (tile.mergedFrom) {
          tile.mergedFrom.forEach((merged) => {
            // render the contributing tile at its previous position briefly
            // (visual continuity handled by the new merged tile's pop animation)
          });
        }
      });
    }

    renderTile(tile, cellSize, gap) {
      const value = tile.value;
      const el = document.createElement('div');
      el.className = 'tile tile-' + (value <= 2048 ? value : 'super');

      const left = tile.x * (cellSize + gap);
      const top = tile.y * (cellSize + gap);
      el.style.width = cellSize + 'px';
      el.style.height = cellSize + 'px';
      el.style.left = left + 'px';
      el.style.top = top + 'px';

      if (!tile.previousPosition && !tile.mergedFrom) {
        el.classList.add('tile-new');
      }
      if (tile.mergedFrom) {
        el.classList.add('tile-merged');
      }

      const img = document.createElement('img');
      img.src = imageFor(value);
      img.alt = nameFor(value) + ' (' + value + ')';
      img.loading = 'lazy';
      img.onerror = function () {
        this.onerror = null;
        this.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'tile-fallback';
        fallback.textContent = value;
        el.appendChild(fallback);
      };

      el.appendChild(img);
      this.boardTiles.appendChild(el);
    }

    /* ---------------- Overlay ---------------- */

    showOverlay(type) {
      if (type === 'win') {
        this.overlayTitle.textContent = 'You Win!';
        this.overlayText.textContent = 'You baked the legendary 2048 Royal Cupcake!';
        this.overlayBtn.textContent = 'Keep Playing';
        this.overlayBtn.hidden = false;
        this.overlayEl.hidden = false;
      } else if (type === 'over') {
        this.overlayTitle.textContent = 'Game Over';
        this.overlayText.textContent = 'No more moves left. Try again!';
        this.overlayBtn.textContent = 'Try Again';
        this.overlayBtn.hidden = false;
        this.overlayEl.hidden = false;
      }
    }

    hideOverlay() {
      this.overlayEl.hidden = true;
    }
  }

  /* =========================================================
     Init
     ========================================================= */

  document.addEventListener('DOMContentLoaded', () => {
    const game = new GameManager();
    // Re-render once layout settles (fonts/images affecting board size)
    window.requestAnimationFrame(() => game.actuate());
    setTimeout(() => game.actuate(), 200);
  });
})();
