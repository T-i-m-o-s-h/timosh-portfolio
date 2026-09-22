import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

/** Tracks the user's reduced-motion preference and reacts to live changes. */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly doc = inject(DOCUMENT);
  readonly reduced = signal(false);

  constructor() {
    const win = this.doc.defaultView;
    if (!win?.matchMedia) return;

    const query = win.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced.set(query.matches);
    query.addEventListener('change', (e) => this.reduced.set(e.matches));
  }
}
