import {
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { MotionService } from './motion';

/** Counts the host's text from zero to {@link to} the first time it's seen. */
@Directive({ selector: '[appCountUp]' })
export class CountUpDirective implements OnInit, OnDestroy {
  readonly to = input.required<number>();
  readonly suffix = input('');
  readonly duration = input(1600);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly motion = inject(MotionService);
  private observer?: IntersectionObserver;
  private frame = 0;

  ngOnInit(): void {
    const target = this.to();
    const render = (n: number) => {
      this.host.nativeElement.textContent = `${n}${this.suffix()}`;
    };

    if (this.motion.reduced() || typeof IntersectionObserver === 'undefined') {
      render(target);
      return;
    }

    render(0);
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          this.observer?.disconnect();
          this.run(target, render);
        },
        { threshold: 0.5 },
      );
      this.observer.observe(this.host.nativeElement);
    });
  }

  private run(target: number, render: (n: number) => void): void {
    const total = this.duration();
    const startedAt = performance.now();

    const step = (now: number) => {
      const t = Math.min((now - startedAt) / total, 1);
      // easeOutExpo — fast off the line, settles softly on the final value.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      render(Math.round(eased * target));
      if (t < 1) this.frame = requestAnimationFrame(step);
    };

    this.frame = requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    cancelAnimationFrame(this.frame);
  }
}
