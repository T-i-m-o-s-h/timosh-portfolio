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

/** Tips the host in 3D toward the pointer. */
@Directive({ selector: '[appTilt]' })
export class TiltDirective implements OnInit, OnDestroy {
  /** Maximum rotation in degrees. */
  readonly max = input(7);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly motion = inject(MotionService);

  private readonly onMove = (e: PointerEvent) => {
    const el = this.host.nativeElement;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const m = this.max();
    el.style.transform =
      `perspective(900px) rotateX(${-py * m}deg) rotateY(${px * m}deg) translate3d(0,-4px,0)`;
  };

  private readonly onLeave = () => {
    this.host.nativeElement.style.transform = '';
  };

  ngOnInit(): void {
    if (this.motion.reduced()) return;
    const el = this.host.nativeElement;
    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform 0.5s var(--ease-out)';

    this.zone.runOutsideAngular(() => {
      el.addEventListener('pointermove', this.onMove, { passive: true });
      el.addEventListener('pointerleave', this.onLeave, { passive: true });
    });
  }

  ngOnDestroy(): void {
    const el = this.host.nativeElement;
    el.removeEventListener('pointermove', this.onMove);
    el.removeEventListener('pointerleave', this.onLeave);
  }
}
