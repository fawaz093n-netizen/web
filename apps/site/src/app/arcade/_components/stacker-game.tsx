"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { beep } from "./arcade-audio";
import styles from "./arcade.module.css";

const COLS = 10;
const ROWS = 20;
const CELL = 24;
const BOARD_X = 16;
const BOARD_Y = 16;
const W = 380;
const H = 512;
const PANEL_X = 276;

const LINE_POINTS = [0, 100, 300, 500, 800];
const LINES_PER_LEVEL = 10;
const CLEAR_FLASH_MS = 260;

type Phase = "ready" | "playing" | "paused" | "over";
type PieceType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
type Cell = string | null;
type Active = { type: PieceType; rot: number; x: number; y: number };

const PIECE_DEFS: Record<PieceType, { color: string; size: number; cells: [number, number][] }> = {
  I: {
    color: "#22d3ee",
    size: 4,
    cells: [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
  },
  O: {
    color: "#facc15",
    size: 2,
    cells: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
  },
  T: {
    color: "#c084fc",
    size: 3,
    cells: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
  S: {
    color: "#4ade80",
    size: 3,
    cells: [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
  },
  Z: {
    color: "#f87171",
    size: 3,
    cells: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
  },
  J: {
    color: "#60a5fa",
    size: 3,
    cells: [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
  L: {
    color: "#fb923c",
    size: 3,
    cells: [
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
};

const PIECE_TYPES = Object.keys(PIECE_DEFS) as PieceType[];

// Precompute all four rotation states for each piece (clockwise).
const ROTATIONS: Record<PieceType, [number, number][][]> = Object.fromEntries(
  PIECE_TYPES.map((type) => {
    const { size, cells } = PIECE_DEFS[type];
    const states: [number, number][][] = [cells];
    for (let i = 0; i < 3; i++) {
      states.push(states[i].map(([x, y]) => [size - 1 - y, x] as [number, number]));
    }
    return [type, states];
  }),
) as Record<PieceType, [number, number][][]>;

const KICKS = [0, -1, 1, -2, 2];

function formatScore(score: number) {
  return score.toString().padStart(6, "0");
}

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null));
}

export function StackerGame({
  hiScore,
  onGameOver,
}: {
  hiScore: number;
  onGameOver: (score: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const board = useRef<Cell[][]>(emptyBoard());
  const active = useRef<Active | null>(null);
  const bag = useRef<PieceType[]>([]);
  const nextPiece = useRef<PieceType>("T");
  const keys = useRef(new Set<string>());
  const gravityAcc = useRef(0);
  const clearing = useRef<number[]>([]);
  const freeze = useRef(0);
  const touchState = useRef<{ x: number; y: number; t: number; moved: number } | null>(null);

  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const levelRef = useRef(1);
  const phaseRef = useRef<Phase>("ready");
  const bestAtRoundStart = useRef(0);
  const hiScoreRef = useRef(hiScore);
  hiScoreRef.current = hiScore;
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [banner, setBanner] = useState<string | null>(null);
  const bannerTimeout = useRef<number | undefined>(undefined);

  const changePhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const showBanner = useCallback((text: string) => {
    setBanner(text);
    window.clearTimeout(bannerTimeout.current);
    bannerTimeout.current = window.setTimeout(() => setBanner(null), 1200);
  }, []);

  useEffect(() => () => window.clearTimeout(bannerTimeout.current), []);

  const drawFromBag = useCallback((): PieceType => {
    if (bag.current.length === 0) {
      const fresh = [...PIECE_TYPES];
      for (let i = fresh.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fresh[i], fresh[j]] = [fresh[j], fresh[i]];
      }
      bag.current = fresh;
    }
    return bag.current.pop() as PieceType;
  }, []);

  const collides = useCallback((type: PieceType, rot: number, px: number, py: number) => {
    for (const [cx, cy] of ROTATIONS[type][rot]) {
      const x = px + cx;
      const y = py + cy;
      if (x < 0 || x >= COLS || y >= ROWS) return true;
      if (y >= 0 && board.current[y][x]) return true;
    }
    return false;
  }, []);

  const gameOver = useCallback(() => {
    active.current = null;
    beep(300, 40, 0.7, 0.09, "sawtooth");
    changePhase("over");
    onGameOverRef.current(scoreRef.current);
  }, [changePhase]);

  const spawn = useCallback(() => {
    const type = nextPiece.current;
    nextPiece.current = drawFromBag();
    const piece: Active = { type, rot: 0, x: 3, y: -1 };
    if (collides(type, 0, piece.x, piece.y)) {
      gameOver();
      return;
    }
    active.current = piece;
  }, [drawFromBag, collides, gameOver]);

  const addScore = useCallback((points: number) => {
    scoreRef.current += points;
    setScore(scoreRef.current);
  }, []);

  const lock = useCallback(() => {
    const piece = active.current;
    if (!piece) return;
    let toppedOut = false;
    for (const [cx, cy] of ROTATIONS[piece.type][piece.rot]) {
      const y = piece.y + cy;
      if (y < 0) {
        toppedOut = true;
        continue;
      }
      board.current[y][piece.x + cx] = PIECE_DEFS[piece.type].color;
    }
    active.current = null;
    if (toppedOut) {
      gameOver();
      return;
    }

    const full: number[] = [];
    for (let y = 0; y < ROWS; y++) {
      if (board.current[y].every(Boolean)) full.push(y);
    }
    if (full.length > 0) {
      clearing.current = full;
      freeze.current = CLEAR_FLASH_MS;
      if (full.length === 4) beep(400, 1400, 0.35, 0.08);
      else beep(500, 900, 0.15, 0.06);
    } else {
      beep(150, 90, 0.06, 0.05);
      spawn();
    }
  }, [gameOver, spawn]);

  const finishClear = useCallback(() => {
    const cleared = clearing.current.length;
    board.current = board.current.filter((_, y) => !clearing.current.includes(y));
    while (board.current.length < ROWS) {
      board.current.unshift(Array.from({ length: COLS }, () => null));
    }
    clearing.current = [];
    addScore(LINE_POINTS[cleared] * levelRef.current);
    linesRef.current += cleared;
    setLines(linesRef.current);
    const newLevel = Math.floor(linesRef.current / LINES_PER_LEVEL) + 1;
    if (newLevel > levelRef.current) {
      levelRef.current = newLevel;
      setLevel(newLevel);
      showBanner(`LEVEL ${newLevel.toString().padStart(2, "0")}`);
      beep(660, 1320, 0.2, 0.07);
    }
    spawn();
  }, [addScore, spawn, showBanner]);

  const move = useCallback(
    (dx: number) => {
      const piece = active.current;
      if (!piece || freeze.current > 0) return;
      if (!collides(piece.type, piece.rot, piece.x + dx, piece.y)) {
        piece.x += dx;
      }
    },
    [collides],
  );

  const rotate = useCallback(
    (dir: 1 | -1) => {
      const piece = active.current;
      if (!piece || freeze.current > 0) return;
      const newRot = (piece.rot + dir + 4) % 4;
      for (const kick of KICKS) {
        if (!collides(piece.type, newRot, piece.x + kick, piece.y)) {
          piece.rot = newRot;
          piece.x += kick;
          beep(300, 420, 0.04, 0.03);
          return;
        }
      }
    },
    [collides],
  );

  const softStep = useCallback(() => {
    const piece = active.current;
    if (!piece) return;
    if (!collides(piece.type, piece.rot, piece.x, piece.y + 1)) {
      piece.y += 1;
    } else {
      lock();
    }
  }, [collides, lock]);

  const hardDrop = useCallback(() => {
    const piece = active.current;
    if (!piece || freeze.current > 0) return;
    let dropped = 0;
    while (!collides(piece.type, piece.rot, piece.x, piece.y + 1)) {
      piece.y += 1;
      dropped++;
    }
    addScore(dropped * 2);
    beep(200, 70, 0.06, 0.05);
    lock();
  }, [collides, addScore, lock]);

  const reset = useCallback(() => {
    board.current = emptyBoard();
    bag.current = [];
    scoreRef.current = 0;
    linesRef.current = 0;
    levelRef.current = 1;
    setScore(0);
    setLines(0);
    setLevel(1);
    bestAtRoundStart.current = hiScoreRef.current;
    clearing.current = [];
    freeze.current = 0;
    gravityAcc.current = 0;
    nextPiece.current = drawFromBag();
    active.current = null;
    changePhase("ready");
  }, [drawFromBag, changePhase]);

  const start = useCallback(() => {
    beep(440, 880, 0.12);
    spawn();
    changePhase("playing");
  }, [spawn, changePhase]);

  const tick = useCallback(
    (dt: number) => {
      if (freeze.current > 0) {
        freeze.current -= dt;
        if (freeze.current <= 0 && clearing.current.length > 0) {
          finishClear();
        }
        return;
      }
      if (!active.current) return;

      const softDropping = keys.current.has("arrowdown") || keys.current.has("s");
      const interval = softDropping ? 40 : Math.max(70, 800 * Math.pow(0.82, levelRef.current - 1));
      gravityAcc.current += dt;
      while (gravityAcc.current >= interval) {
        gravityAcc.current -= interval;
        const before = active.current?.y ?? 0;
        softStep();
        if (softDropping && active.current && active.current.y > before) {
          addScore(1);
        }
        if (!active.current || freeze.current > 0) break;
      }
    },
    [softStep, finishClear, addScore],
  );

  const drawCell = useCallback(
    (ctx: CanvasRenderingContext2D, px: number, py: number, color: string, size = CELL) => {
      ctx.fillStyle = color;
      ctx.fillRect(px, py, size, size);
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fillRect(px, py, size, 3);
      ctx.fillRect(px, py, 3, size);
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(px, py + size - 3, size, 3);
      ctx.fillRect(px + size - 3, py, 3, size);
    },
    [],
  );

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#060210";
    ctx.fillRect(0, 0, W, H);

    // Board well.
    ctx.fillStyle = "#0b0520";
    ctx.fillRect(BOARD_X, BOARD_Y, COLS * CELL, ROWS * CELL);
    ctx.strokeStyle = "rgba(192, 132, 252, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(BOARD_X - 1, BOARD_Y - 1, COLS * CELL + 2, ROWS * CELL + 2);
    ctx.strokeStyle = "rgba(192, 132, 252, 0.06)";
    ctx.lineWidth = 1;
    for (let x = 1; x < COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(BOARD_X + x * CELL + 0.5, BOARD_Y);
      ctx.lineTo(BOARD_X + x * CELL + 0.5, BOARD_Y + ROWS * CELL);
      ctx.stroke();
    }
    for (let y = 1; y < ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(BOARD_X, BOARD_Y + y * CELL + 0.5);
      ctx.lineTo(BOARD_X + COLS * CELL, BOARD_Y + y * CELL + 0.5);
      ctx.stroke();
    }

    // Locked cells (clearing rows flash white).
    for (let y = 0; y < ROWS; y++) {
      const flashing = clearing.current.includes(y) && Math.floor(freeze.current / 65) % 2 === 0;
      for (let x = 0; x < COLS; x++) {
        const cell = board.current[y][x];
        if (!cell) continue;
        drawCell(ctx, BOARD_X + x * CELL, BOARD_Y + y * CELL, flashing ? "#f8fafc" : cell);
      }
    }

    const piece = active.current;
    if (piece) {
      const { color } = PIECE_DEFS[piece.type];

      // Ghost — where the piece would land.
      let ghostY = piece.y;
      while (!collides(piece.type, piece.rot, piece.x, ghostY + 1)) ghostY++;
      if (ghostY !== piece.y) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 2;
        for (const [cx, cy] of ROTATIONS[piece.type][piece.rot]) {
          const y = ghostY + cy;
          if (y < 0) continue;
          ctx.strokeRect(
            BOARD_X + (piece.x + cx) * CELL + 2,
            BOARD_Y + y * CELL + 2,
            CELL - 4,
            CELL - 4,
          );
        }
      }

      for (const [cx, cy] of ROTATIONS[piece.type][piece.rot]) {
        const y = piece.y + cy;
        if (y < 0) continue;
        drawCell(ctx, BOARD_X + (piece.x + cx) * CELL, BOARD_Y + y * CELL, color);
      }
    }

    // Next-piece panel.
    ctx.strokeStyle = "rgba(192, 132, 252, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(PANEL_X, BOARD_Y, 88, 88);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px monospace";
    ctx.fillText("NEXT", PANEL_X + 30, BOARD_Y + 14);
    const next = nextPiece.current;
    const def = PIECE_DEFS[next];
    const previewCell = 16;
    const offsetX = PANEL_X + 44 - (def.size * previewCell) / 2;
    const offsetY = BOARD_Y + 52 - previewCell;
    for (const [cx, cy] of ROTATIONS[next][0]) {
      drawCell(ctx, offsetX + cx * previewCell, offsetY + cy * previewCell, def.color, previewCell);
    }
  }, [collides, drawCell]);

  useEffect(() => {
    reset();
  }, [reset]);

  // Bank the running score if the player closes the overlay mid-game —
  // death already reports via gameOver(), so only cover the quit path here.
  useEffect(
    () => () => {
      if (phaseRef.current !== "over" && scoreRef.current > 0) {
        onGameOverRef.current(scoreRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (phase !== "playing") {
      draw();
      return;
    }
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      tick(dt);
      draw();
      if (phaseRef.current === "playing") {
        raf = requestAnimationFrame(frame);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase, tick, draw]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const currentPhase = phaseRef.current;
      const gameKeys = [
        "arrowleft",
        "arrowright",
        "arrowdown",
        "arrowup",
        "a",
        "d",
        "s",
        "w",
        "x",
        "z",
        " ",
      ];

      if (gameKeys.includes(key)) {
        event.preventDefault();
        keys.current.add(key);
        if (currentPhase === "ready") {
          start();
          return;
        }
        if (currentPhase !== "playing") return;
        // Native key repeat gives us held-move for free; block it for
        // rotate and hard drop, which must fire once per press.
        if (key === "arrowleft" || key === "a") move(-1);
        else if (key === "arrowright" || key === "d") move(1);
        else if ((key === "arrowup" || key === "x" || key === "w") && !event.repeat) rotate(1);
        else if (key === "z" && !event.repeat) rotate(-1);
        else if (key === " " && !event.repeat) hardDrop();
        return;
      }

      if (key === "p" && (currentPhase === "playing" || currentPhase === "paused")) {
        changePhase(currentPhase === "playing" ? "paused" : "playing");
        return;
      }

      if (key === "enter") {
        event.preventDefault();
        if (currentPhase === "ready") start();
        else if (currentPhase === "over") reset();
        else if (currentPhase === "paused") changePhase("playing");
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      keys.current.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [start, move, rotate, hardDrop, changePhase, reset]);

  const onTouchStart = useCallback(
    (event: React.TouchEvent) => {
      const currentPhase = phaseRef.current;
      if (currentPhase === "ready") {
        start();
        return;
      }
      if (currentPhase === "over") {
        reset();
        return;
      }
      if (currentPhase === "paused") {
        changePhase("playing");
        return;
      }
      const touch = event.touches[0];
      touchState.current = { x: touch.clientX, y: touch.clientY, t: performance.now(), moved: 0 };
    },
    [start, reset, changePhase],
  );

  const onTouchMove = useCallback(
    (event: React.TouchEvent) => {
      const state = touchState.current;
      if (!state || phaseRef.current !== "playing") return;
      const touch = event.touches[0];
      const canvas = canvasRef.current;
      const scale = canvas ? canvas.getBoundingClientRect().width / W : 1;
      const threshold = CELL * scale;
      // Drag sideways to slide the piece, one column per cell-width.
      while (touch.clientX - state.x > threshold) {
        move(1);
        state.x += threshold;
        state.moved++;
      }
      while (state.x - touch.clientX > threshold) {
        move(-1);
        state.x -= threshold;
        state.moved++;
      }
      // Drag down to soft-drop.
      while (touch.clientY - state.y > threshold) {
        softStep();
        state.y += threshold;
        state.moved++;
      }
    },
    [move, softStep],
  );

  const onTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      const state = touchState.current;
      touchState.current = null;
      if (!state || phaseRef.current !== "playing") return;
      const touch = event.changedTouches[0];
      const dt = performance.now() - state.t;
      const dy = touch.clientY - state.y;
      // Fast flick down → hard drop; quick tap → rotate.
      if (dt < 300 && dy > 60) hardDrop();
      else if (dt < 250 && state.moved === 0) rotate(1);
    },
    [hardDrop, rotate],
  );

  const isNewBest = phase === "over" && score > 0 && score > bestAtRoundStart.current;

  return (
    <div className={styles.gameWrap}>
      <div className={styles.gameHud}>
        <span>
          SCORE <b>{formatScore(score)}</b>
        </span>
        <span>
          LINES <b>{lines.toString().padStart(3, "0")}</b>
        </span>
        <span>
          LV <b>{level.toString().padStart(2, "0")}</b>
        </span>
        <span>
          HI <b>{formatScore(Math.max(hiScore, score))}</b>
        </span>
      </div>
      <div className={styles.gameScreen}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className={styles.gameCanvas}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
        {banner && phase === "playing" && <div className={styles.waveBanner}>{banner}</div>}
        {phase !== "playing" && (
          <div className={styles.gameMsg}>
            {phase === "ready" && (
              <>
                <span>READY?</span>
                <span className={styles.gameMsgSub}>Press any key to start — or tap</span>
              </>
            )}
            {phase === "paused" && <span className={styles.blink}>PAUSED</span>}
            {phase === "over" && (
              <>
                <span>GAME OVER</span>
                <span>SCORE {formatScore(score)}</span>
                {isNewBest && <span className={styles.newBest}>★ NEW HI-SCORE ★</span>}
                <span className={styles.gameMsgSub}>Press Enter or tap to play again</span>
              </>
            )}
          </div>
        )}
        <div className={styles.gameScanlines} aria-hidden />
      </div>
      <p className={styles.gameControls}>◀ ▶ MOVE — ▲ ROTATE — ▼ SOFT — SPACE DROP — P PAUSE</p>
    </div>
  );
}
