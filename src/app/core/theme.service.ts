import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';

/**
 * Owns the active theme. The attribute is already on <html> before Angular
 * boots (see the inline script in index.html), so this reads that as its
 * starting point rather than re-deciding and causing a flash.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  readonly theme = signal<Theme>('dark');

  constructor() {
    const stamped = this.doc.documentElement.getAttribute('data-theme');
    this.theme.set(stamped === 'light' ? 'light' : 'dark');

    effect(() => this.apply(this.theme()));
  }

  toggle(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private apply(theme: Theme): void {
    const root = this.doc.documentElement;
    root.setAttribute('data-theme', theme);

    // Keep the mobile browser chrome in step with the page.
    const meta = this.doc.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', theme === 'light' ? '#f4f5f8' : '#05060a');

    // Storage is unavailable in some privacy modes; the theme still works,
    // it just won't be remembered.
    try {
      this.doc.defaultView?.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }
}
