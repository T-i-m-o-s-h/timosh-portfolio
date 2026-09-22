import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  viewChild,
} from '@angular/core';
import { MotionService } from '../../core/motion';
import { PointerService } from '../../core/pointer.service';

/**
 * A dot that tracks the pointer exactly and a ring that lags behind it. The
 * ring swells over anything marked `data-cursor`.
 */
@Component({
  selector: 'app-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #ring class="cursor-ring" aria-hidden="true">
      <span class="cursor-label" #label></span>
    </div>
    <div #dot class="cursor-dot" aria-hidden="true"></div>
  `,
  styleUrl: './cursor.scss',
})
export class CursorComponent implements AfterViewInit, OnDestroy {
  private readonly ringRef = viewChild.required<ElementRef<HTMLElement>>('ring');
  private readonly dotRef = viewChild.required<ElementRef<HTMLElement>>('dot');
  private readonly labelRef = viewChild.required<ElementRef<HTMLElement>>('label');

  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly pointer = inject(PointerService);
  private readonly motion = inject(MotionService);

  private frame = 0;
  private rx = 0;
  private ry = 0;
  private enabled = false;

  ngAfterViewInit(): void {
    if (!this.pointer.fine() || this.motion.reduced()) return;

    this.enabled = true;
    this.doc.body.classList.add('has-custom-cursor');
    this.rx = this.pointer.x();
    this.ry = this.pointer.y();

    this.zone.runOutsideAngular(() => {
      this.doc.addEventListener('pointerover', this.onOver, { passive: true });
      this.doc.addEventListener('pointerdown', this.onDown, { passive: true });
      this.doc.addEventListener('pointerup', this.onUp, { passive: true });
      this.loop();
    });
  }

  private readonly onOver = (e: PointerEvent) => {
    const target = (e.target as Element | null)?.closest<HTMLElement>(
      '[data-cursor], a, button, input, textarea',
    );
    const ring = this.ringRef().nativeElement;
    const label = this.labelRef().nativeElement;
    const text = target?.dataset['cursor'];

    ring.classList.toggle('is-hover', !!target);
    ring.classList.toggle('has-label', !!text);
    label.textContent = text ?? '';
  };

  private readonly onDown = () => this.ringRef().nativeElement.classList.add('is-down');
  private readonly onUp = () => this.ringRef().nativeElement.classList.remove('is-down');

  private readonly loop = () => {
    const x = this.pointer.x();
    const y = this.pointer.y();

    // The dot is exact; the ring eases toward it for a trailing feel.
    this.rx += (x - this.rx) * 0.16;
    this.ry += (y - this.ry) * 0.16;

    this.dotRef().nativeElement.style.transform =
      `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    this.ringRef().nativeElement.style.transform =
      `translate3d(${this.rx}px, ${this.ry}px, 0) translate(-50%, -50%)`;

    this.frame = requestAnimationFrame(this.loop);
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    if (!this.enabled) return;
    this.doc.body.classList.remove('has-custom-cursor');
    this.doc.removeEventListener('pointerover', this.onOver);
    this.doc.removeEventListener('pointerdown', this.onDown);
    this.doc.removeEventListener('pointerup', this.onUp);
  }
}
