import {
  AfterViewInit,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  input,
} from '@angular/core';
import { MotionService } from './motion';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';

/** Decodes the host's text out of random glyphs when it scrolls into view. */
@Directive({ selector: '[appScramble]' })
export class ScrambleDirective implements AfterViewInit, OnDestroy {
  /** Milliseconds each character spends scrambled. */
  readonly speed = input(38);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly motion = inject(MotionService);
  private observer?: IntersectionObserver;
  private timer?: ReturnType<typeof setInterval>;
  private finalText = '';

  ngAfterViewInit(): void {
    if (this.motion.reduced() || typeof IntersectionObserver === 'undefined') return;

    const el = this.host.nativeElement;
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          this.observer?.disconnect();
          // Read the text here, not on init: interpolated content isn't in the
          // DOM until change detection has run, and capturing '' would erase it.
          this.finalText = el.textContent ?? '';
          if (this.finalText.trim()) this.play(el, this.finalText);
        },
        { threshold: 0.6 },
      );
      this.observer.observe(el);
    });
  }

  private play(el: HTMLElement, final: string): void {
    let revealed = 0;
    this.timer = setInterval(() => {
      revealed++;
      if (revealed > final.length) {
        el.textContent = final;
        clearInterval(this.timer);
        return;
      }
      const head = final.slice(0, revealed);
      const tail = Array.from(final.slice(revealed))
        .map((ch) => (ch === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
        .join('');
      el.textContent = head + tail;
    }, this.speed());
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    clearInterval(this.timer);
    // Don't leave the host stuck on glyphs if we're torn down mid-scramble.
    if (this.finalText) this.host.nativeElement.textContent = this.finalText;
  }
}
