import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MagneticDirective } from '../../core/magnetic.directive';
import { RevealDirective } from '../../core/reveal.directive';
import { PROFILE } from '../../core/resume.data';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, MagneticDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent {
  protected readonly profile = PROFILE;
  protected readonly year = new Date().getFullYear();
  protected readonly tel = PROFILE.phone.replace(/\s+/g, '');
  protected readonly copied = signal(false);

  private resetTimer?: ReturnType<typeof setTimeout>;

  /** Clipboard access can be denied or unavailable — fall back silently. */
  protected async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.profile.email);
      this.copied.set(true);
      clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(() => this.copied.set(false), 2200);
    } catch {
      window.location.href = `mailto:${this.profile.email}`;
    }
  }
}
