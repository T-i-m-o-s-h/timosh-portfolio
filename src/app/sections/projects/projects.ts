import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeadingComponent } from '../../components/section-heading/section-heading';
import { RevealDirective } from '../../core/reveal.directive';
import { SpotlightDirective } from '../../core/spotlight.directive';
import { TiltDirective } from '../../core/tilt.directive';
import { PROJECTS } from '../../core/resume.data';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeadingComponent, RevealDirective, SpotlightDirective, TiltDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent {
  protected readonly projects = PROJECTS;

  protected number(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
