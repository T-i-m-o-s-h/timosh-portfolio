import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeadingComponent } from '../../components/section-heading/section-heading';
import { CountUpDirective } from '../../core/count-up.directive';
import { RevealDirective } from '../../core/reveal.directive';
import { ABOUT_PARAGRAPHS, EDUCATION, LANGUAGES, PROFILE, STATS } from '../../core/resume.data';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeadingComponent, RevealDirective, CountUpDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {
  protected readonly profile = PROFILE;
  protected readonly paragraphs = ABOUT_PARAGRAPHS;
  protected readonly stats = STATS;
  protected readonly education = EDUCATION;
  protected readonly languages = LANGUAGES;
}
