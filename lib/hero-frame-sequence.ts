/** Keep compressed frames ready, but retain only eight decoded images in memory. */
export class HeroFrameSequence {
  private readonly controller = new AbortController();
  private readonly blobs = new Map<number, Promise<Blob>>();
  private readonly decoded = new Map<number, ImageBitmap>();
  private target = 0;
  private reading = false;
  private disposed = false;

  constructor(
    private readonly basePath: string,
    private readonly count: number,
    private readonly onFrame: (index: number, image: ImageBitmap) => void,
    private readonly onError: () => void,
  ) {}

  private blob(index: number) {
    let promise = this.blobs.get(index);
    if (!promise) {
      promise = fetch(`${this.basePath}/${String(index).padStart(3, "0")}.webp`, {
        signal: this.controller.signal,
      }).then((response) => {
        if (!response.ok) throw new Error("Hero frame unavailable");
        return response.blob();
      });
      this.blobs.set(index, promise);
    }
    return promise;
  }

  request(index: number) {
    if (this.disposed) return;
    this.target = Math.max(0, Math.min(this.count - 1, index));
    const cached = this.decoded.get(this.target);
    if (cached) this.onFrame(this.target, cached);
    else if (!this.reading) void this.read();
  }

  private async read() {
    this.reading = true;
    try {
      while (!this.disposed) {
        const index = this.target;
        let image = this.decoded.get(index);
        if (!image) {
          const blob = await this.blob(index);
          if (this.disposed) break;
          image = await createImageBitmap(blob);
          if (this.disposed) {
            image.close();
            break;
          }
          this.decoded.set(index, image);
          if (this.decoded.size > 8) {
            const farthest = [...this.decoded.keys()].filter((key) => key !== index).sort(
              (a, b) => Math.abs(b - this.target) - Math.abs(a - this.target),
            )[0];
            if (farthest !== index) {
              this.decoded.get(farthest)?.close();
              this.decoded.delete(farthest);
            }
          }
        }
        const targetImage = this.decoded.get(this.target);
        this.onFrame(targetImage ? this.target : index, targetImage ?? image);
        if (index === this.target || targetImage) break;
      }
    } catch {
      if (!this.disposed) this.onError();
    } finally {
      this.reading = false;
    }
  }

  warm() {
    // Coarse coverage first makes a fast scroll to the end available early.
    const order = new Set([0, this.count - 1]);
    for (const stride of [16, 8, 4, 2, 1]) {
      for (let index = 0; index < this.count; index += stride) order.add(index);
    }
    const queue = [...order];
    const worker = async () => {
      while (!this.disposed && queue.length) {
        const index = queue.shift();
        if (index === undefined) return;
        try {
          await this.blob(index);
        } catch {
          // A requested frame reports a failure; speculative fetches stay quiet.
          if (this.disposed) return;
        }
      }
    };
    for (let index = 0; index < 3; index++) void worker();
  }

  dispose() {
    this.disposed = true;
    this.controller.abort();
    this.decoded.forEach((image) => image.close());
    this.decoded.clear();
    this.blobs.clear();
  }
}
