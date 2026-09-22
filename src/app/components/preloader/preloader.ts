import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  OnDestroy,
  OnInit,
  inject,
  output,
  signal,
} from '@angular/core';
import { MotionService } from '../../core/motion';

/**
 * Holds the page for a beat while the WebGL context warms up, then lifts away.
 * Skipped entirely under reduced motion.
 */
@Component({
  selector: 'app-preloader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="preloader" [class.is-leaving]="leaving()">
        <div class="preloader__inner">
          <div class="preloader__name">
            <span>Timosh</span>
            <span class="preloader__rr">R R</span>
          </div>
          <div class="preloader__bar" role="progressbar" [attr.aria-valuenow]="count()"
               aria-valuemin="0" aria-valuemax="100" aria-label="Loading portfolio">
            <span class="preloader__fill" [style.transform]="'scaleX(' + count() / 100 + ')'"></span>
          </div>
          <div class="preloader__count">{{ count() }}</div>
        </div>
      </div>
    }
  `,
  styleUrl: './preloader.scss',
})
export class PreloaderComponent implements OnInit, OnDestroy {
  readonly done = output<void>();

  readonly count = signal(0);
  readonly visible = signal(true);
  readonly leaving = signal(false);

  private readonly doc = inject(DOCUMENT);
  private readonly motion = inject(MotionService);
  private timer?: ReturnType<typeof setInterval>;
  private timeouts: ReturnType<typeof setTimeout>[] = [];

  ngOnInit(): void {
    if (this.motion.reduced()) {
      this.visible.set(false);
      this.done.emit();
      return;
    }

    this.doc.body.classList.add('is-locked');

    this.timer = setInterval(() => {
      // Ease the counter so it decelerates into 100 rather than ticking evenly.
      const next = this.count() + Math.max(1, Math.round((100 - this.count()) * 0.12));
      if (next >= 100) {
        this.count.set(100);
        clearInterval(this.timer);
        this.finish();
        return;
      }
      this.count.set(next);
    }, 26);
  }

  private finish(): void {
    this.timeouts.push(
      setTimeout(() => {
        this.leaving.set(true);
        this.doc.body.classList.remove('is-locked');
        this.done.emit();
      }, 220),
      setTimeout(() => this.visible.set(false), 1400),
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.timeouts.forEach(clearTimeout);
    this.doc.body.classList.remove('is-locked');
  }
}
