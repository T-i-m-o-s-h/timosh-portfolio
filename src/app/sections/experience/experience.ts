import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SectionHeadingComponent } from '../../components/section-heading/section-heading';
import { RevealDirective } from '../../core/reveal.directive';
import { EXPERIENCE } from '../../core/resume.data';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeadingComponent, RevealDirective],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class ExperienceComponent {
  protected readonly roles = EXPERIENCE;

  /** Index of the open entry. The current role starts expanded. */
  protected readonly open = signal(0);

  protected toggle(index: number): void {
    this.open.set(this.open() === index ? -1 : index);
  }
}
