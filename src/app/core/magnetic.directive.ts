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

/** Pulls the host toward the cursor while it hovers, then springs back. */
@Directive({ selector: '[appMagnetic]' })
export class MagneticDirective implements OnInit, OnDestroy {
  /** How far the element may travel, in pixels. */
  readonly strength = input(14);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly motion = inject(MotionService);

  private readonly onMove = (e: PointerEvent) => {
    const el = this.host.nativeElement;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const s = this.strength();
    el.style.transform = `translate3d(${dx * s}px, ${dy * s}px, 0)`;
  };

  private readonly onLeave = () => {
    this.host.nativeElement.style.transform = '';
  };

  ngOnInit(): void {
    if (this.motion.reduced()) return;
    const el = this.host.nativeElement;
    el.style.transition = 'transform 0.45s var(--ease-spring)';

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
