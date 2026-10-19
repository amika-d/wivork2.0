// The /process film: 241 frames in two sets, shared by the page and the home-page prefetch.
export const TOTAL_FRAMES = 241;
export const LAST_FRAME = TOTAL_FRAMES - 1;

// Portrait screens only ever show the middle of the 16:9 film, so they get a cropped 540 × 720 set.
export type FrameSet = 'd' | 'm';
export const pickFrameSet = (): FrameSet => window.matchMedia('(max-aspect-ratio: 1/1)').matches ? 'm' : 'd';
export const framePath = (set: FrameSet, frame: number) => `/process/film/${set}/f_${String(frame).padStart(3, '0')}.webp`;

/** Evenly spaced frames decoded first, so every stage of the film has something to show. */
export function keyframes(set: FrameSet) {
  const count = set === 'm' ? 9 : 17;
  return Array.from({ length: count }, (_, index) => Math.round(index * LAST_FRAME / (count - 1)));
}
