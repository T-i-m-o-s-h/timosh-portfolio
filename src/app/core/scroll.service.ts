import { DOCUMENT, Injectable, NgZone, inject, signal } from '@angular/core';
import { NAV_LINKS } from './resume.data';

/**
 * Single source of truth for "where is the page right now" — drives the
 * progress bar, the nav's condensed state and the active rail dot.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);

  /** 0 → 1 through the whole document. */
  readonly progress = signal(0);
  readonly scrolled = signal(false);
  readonly activeSection = signal<string>(NAV_LINKS[0].id);

  private ticking = false;

  constructor() {
    const win = this.doc.defaultView;
    if (!win) return;

    this.zone.runOutsideAngular(() => {
      win.addEventListener('scroll', this.onScroll, { passive: true });
      win.addEventListener('resize', this.onScroll, { passive: true });
    });
    this.observeSections();
    this.measure();
  }

  scrollTo(id: string): void {
    this.doc.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private readonly onScroll = () => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.measure();
      this.ticking = false;
    });
  };

  private measure(): void {
    const el = this.doc.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    this.progress.set(max > 0 ? Math.min(el.scrollTop / max, 1) : 0);
    this.scrolled.set(el.scrollTop > 40);
  }

  /**
   * Picks the section covering the upper third of the viewport. A plain
   * "most visible" test flickers between neighbours on tall sections.
   */
  private observeSections(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) this.activeSection.set(entry.target.id);
          }
        },
        { rootMargin: '-35% 0px -60% 0px' },
      );

      // Sections mount with the app, so wait a frame before querying for them.
      requestAnimationFrame(() => {
        for (const link of NAV_LINKS) {
          const el = this.doc.getElementById(link.id);
          if (el) observer.observe(el);
        }
      });
    });
  }
}
