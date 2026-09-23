import { ChangeDetectionStrategy, Component, DOCUMENT, computed, inject, signal } from '@angular/core';
import { MagneticDirective } from '../../core/magnetic.directive';
import { NAV_LINKS, PROFILE } from '../../core/resume.data';
import { ScrollService } from '../../core/scroll.service';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticDirective],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class NavComponent {
  protected readonly links = NAV_LINKS;
  protected readonly profile = PROFILE;
  protected readonly scroll = inject(ScrollService);
  protected readonly themes = inject(ThemeService);
  protected readonly menuOpen = signal(false);

  /** Labels describe the action, not the current state. */
  protected readonly themeLabel = computed(() =>
    this.themes.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
  );

  private readonly doc = inject(DOCUMENT);

  protected go(id: string): void {
    this.close();
    this.scroll.scrollTo(id);
  }

  protected toggle(): void {
    const next = !this.menuOpen();
    this.menuOpen.set(next);
    this.doc.body.classList.toggle('is-locked', next);
  }

  protected close(): void {
    this.menuOpen.set(false);
    this.doc.body.classList.remove('is-locked');
  }
}
