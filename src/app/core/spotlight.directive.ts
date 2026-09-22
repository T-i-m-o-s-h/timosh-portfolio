import { Directive, ElementRef, NgZone, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Writes the cursor's position within the host to CSS custom properties so a
 * card can render a light that follows the pointer.
 */
@Directive({
  selector: '[appSpotlight]',
  host: { '[class.has-spotlight]': 'true' },
})
export class SpotlightDirective implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);

  private readonly onMove = (e: PointerEvent) => {
    const el = this.host.nativeElement;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.host.nativeElement.addEventListener('pointermove', this.onMove, { passive: true });
    });
  }

  ngOnDestroy(): void {
    this.host.nativeElement.removeEventListener('pointermove', this.onMove);
  }
}
