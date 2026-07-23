// Chunky 8-bit blips via WebAudio — no assets needed. One lazily-created
// context shared by every game; created on first user gesture so autoplay
// policy never blocks it.

let ctx: AudioContext | null = null;

export function beep(
  freq: number,
  endFreq: number,
  duration: number,
  volume = 0.06,
  type: OscillatorType = "square",
) {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), ctx.currentTime + duration);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // No AudioContext — play on in silence.
  }
}
