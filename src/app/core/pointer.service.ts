import { DOCUMENT, Injectable, NgZone, inject, signal } from '@angular/core';

/**
 * One pointer listener shared by the cursor and the WebGL background, so we
 * don't attach a mousemove handler per consumer. Updates run outside Angular.
 */
@Injectable({ providedIn: 'root' })
export class PointerService {
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);

  /** Viewport coordinates in pixels. */
  readonly x = signal(0);
  readonly y = signal(0);
  /** True once a fine pointer has actually moved. */
  readonly active = signal(false);
  readonly fine = signal(false);

  constructor() {
    const win = this.doc.defaultView;
    if (!win) return;

    this.fine.set(win.matchMedia('(hover: hover) and (pointer: fine)').matches);
    this.x.set(win.innerWidth / 2);
    this.y.set(win.innerHeight / 2);

    this.zone.runOutsideAngular(() => {
      win.addEventListener(
        'pointermove',
        (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return;
          this.x.set(e.clientX);
          this.y.set(e.clientY);
          if (!this.active()) this.active.set(true);
        },
        { passive: true },
      );
    });
  }
}
