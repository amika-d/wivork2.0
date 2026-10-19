// Downloads and decodes /process film frames off the main thread, so scrolling never waits on image decoding.
// Downloaded files stay cached here as compressed blobs; the page keeps only a few decoded frames.
type Request = { id: number; url: string; decode: boolean };

const blobs = new Map<string, Promise<Blob>>();

function download(url: string) {
  let blob = blobs.get(url);
  if (!blob) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    blob = fetch(url, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Frame unavailable: ${response.status}`);
        return response.blob();
      })
      .finally(() => clearTimeout(timer));
    // A failed download is forgotten so the next request retries it.
    blob.catch(() => blobs.delete(url));
    blobs.set(url, blob);
  }
  return blob;
}

self.onmessage = async ({ data }: MessageEvent<Request>) => {
  try {
    const blob = await download(data.url);
    if (!data.decode) { self.postMessage({ id: data.id }); return; }
    const bitmap = await createImageBitmap(blob);
    self.postMessage({ id: data.id, bitmap }, { transfer: [bitmap] });
  } catch {
    self.postMessage({ id: data.id, failed: true });
  }
};
