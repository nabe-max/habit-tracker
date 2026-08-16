const FADE_OUT_MS = 2000;

export class SeamlessAmbientPlayer {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private layerA: GainNode | null = null;
  private layerB: GainNode | null = null;
  private buffer: AudioBuffer | null = null;
  private activeLayer: "a" | "b" = "a";
  private loopTimeout: ReturnType<typeof setTimeout> | null = null;
  private volume = 0.7;
  private playing = false;

  private ensureContext(): AudioContext {
    if (!this.context) {
      this.context = new AudioContext();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 1;
      this.masterGain.connect(this.context.destination);

      this.layerA = this.context.createGain();
      this.layerB = this.context.createGain();
      this.layerA.gain.value = 0;
      this.layerB.gain.value = 0;
      this.layerA.connect(this.masterGain);
      this.layerB.connect(this.masterGain);
    }

    return this.context;
  }

  private getCrossfadeSec(): number {
    if (!this.buffer) return 3;
    return Math.min(4, Math.max(1.5, this.buffer.duration * 0.06));
  }

  private clearLoopTimer(): void {
    if (this.loopTimeout !== null) {
      clearTimeout(this.loopTimeout);
      this.loopTimeout = null;
    }
  }

  private playLayer(layer: "a" | "b", fadeIn: boolean): void {
    const ctx = this.ensureContext();
    const buffer = this.buffer;
    const gain = layer === "a" ? this.layerA : this.layerB;
    if (!buffer || !gain) return;

    const crossfade = this.getCrossfadeSec();
    const now = ctx.currentTime;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(gain);

    gain.gain.cancelScheduledValues(now);
    if (fadeIn) {
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.volume, now + crossfade);
    } else {
      gain.gain.setValueAtTime(this.volume, now);
    }

    source.start(now);
    this.activeLayer = layer;

    const nextSwitchMs = Math.max(500, (buffer.duration - crossfade) * 1000);
    this.loopTimeout = setTimeout(() => {
      if (!this.playing) return;

      const nextLayer = layer === "a" ? "b" : "a";
      const fadeOutTime = ctx.currentTime;
      gain.gain.cancelScheduledValues(fadeOutTime);
      gain.gain.setValueAtTime(gain.gain.value, fadeOutTime);
      gain.gain.linearRampToValueAtTime(0, fadeOutTime + crossfade);

      try {
        source.stop(fadeOutTime + crossfade + 0.05);
      } catch {
        // Already stopped.
      }

      this.playLayer(nextLayer, true);
    }, nextSwitchMs);
  }

  async load(url: string): Promise<void> {
    await this.stop(false);
    const ctx = this.ensureContext();
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to load audio");
    }

    const data = await response.arrayBuffer();
    this.buffer = await ctx.decodeAudioData(data);
  }

  async play(): Promise<void> {
    if (!this.buffer) return;

    const ctx = this.ensureContext();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    this.clearLoopTimer();
    this.playing = true;
    this.layerA?.gain.setValueAtTime(0, ctx.currentTime);
    this.layerB?.gain.setValueAtTime(0, ctx.currentTime);
    this.playLayer("a", true);
  }

  async stop(fade = true): Promise<void> {
    this.playing = false;
    this.clearLoopTimer();

    const ctx = this.context;
    const master = this.masterGain;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    if (fade) {
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + FADE_OUT_MS / 1000);
      await new Promise((resolve) => setTimeout(resolve, FADE_OUT_MS + 50));
    }

    master.gain.setValueAtTime(1, ctx.currentTime);
    this.layerA?.gain.setValueAtTime(0, ctx.currentTime);
    this.layerB?.gain.setValueAtTime(0, ctx.currentTime);
  }

  setVolume(value: number): void {
    this.volume = Math.min(1, Math.max(0, value));
    const ctx = this.context;
    if (!ctx || !this.playing) return;

    const gain = this.activeLayer === "a" ? this.layerA : this.layerB;
    if (!gain) return;

    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(this.volume, ctx.currentTime);
  }

  destroy(): void {
    this.playing = false;
    this.clearLoopTimer();
    void this.context?.close();
    this.context = null;
    this.masterGain = null;
    this.layerA = null;
    this.layerB = null;
    this.buffer = null;
  }
}
