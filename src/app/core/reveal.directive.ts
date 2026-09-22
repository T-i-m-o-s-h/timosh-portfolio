import {
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
  input,
} from '@angular/core';

/**
 * Reveals the host once it scrolls into view. Staggering is expressed as a CSS
 * custom property so the transition itself stays in the stylesheet.
 */
@Directive({
  selector: '[appReveal]',
  host: { '[attr.data-reveal]': '""' },
})
export class RevealDirective implements OnInit, OnDestroy {
  /** Delay in milliseconds before this element animates in. */
  readonly appReveal = input<number | string>(0);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const el = this.host.nativeElement;
    el.style.setProperty('--reveal-delay', `${Number(this.appReveal()) || 0}ms`);

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-revealed');
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('is-revealed');
            this.observer?.unobserve(entry.target);
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
      );
      this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
