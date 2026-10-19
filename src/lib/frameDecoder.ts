// Loads film frames through frameWorker, falling back to the main thread if the worker cannot start.
type Reply = { id: number; bitmap?: ImageBitmap; failed?: boolean };

export type FrameDecoder = {
  /** Resolves with the decoded frame, or with undefined when `decode` is false (download only). */
  load(url: string, decode: boolean): Promise<ImageBitmap | undefined>;
  dispose(): void;
};

export const canDecodeFrames = () => typeof createImageBitmap === 'function';

async function loadHere(url: string, decode: boolean) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Frame unavailable: ${response.status}`);
    const blob = await response.blob();
    return decode ? await createImageBitmap(blob) : undefined;
  } finally {
    clearTimeout(timer);
  }
}

export function createFrameDecoder(): FrameDecoder {
  let worker: Worker | undefined;
  let nextId = 0;
  const waiting = new Map<number, (reply: Reply) => void>();
  const failAll = () => {
    for (const [id, settle] of waiting) settle({ id, failed: true });
    waiting.clear();
  };
  try {
    worker = new Worker(new URL('./frameWorker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }: MessageEvent<Reply>) => {
      waiting.get(data.id)?.(data);
      waiting.delete(data.id);
    };
    // A worker that fails to start or crashes hands its work back to the main thread.
    worker.onerror = () => { worker?.terminate(); worker = undefined; failAll(); };
  } catch {
    worker = undefined;
  }
  return {
    load(url, decode) {
      if (!worker) return loadHere(url, decode);
      return new Promise((resolve, reject) => {
        const id = nextId++;
        // Never let a lost reply hold a loading slot forever.
        const watchdog = setTimeout(() => {
          waiting.delete(id);
          reject(new Error('Frame timed out'));
        }, 12000);
        waiting.set(id, reply => {
          clearTimeout(watchdog);
          if (reply.failed) reject(new Error('Frame unavailable'));
          else resolve(reply.bitmap);
        });
        worker!.postMessage({ id, url, decode });
      });
    },
    dispose() {
      worker?.terminate();
      worker = undefined;
      waiting.clear();
    },
  };
}
