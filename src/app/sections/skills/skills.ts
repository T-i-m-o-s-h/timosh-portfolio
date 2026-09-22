import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeadingComponent } from '../../components/section-heading/section-heading';
import { RevealDirective } from '../../core/reveal.directive';
import { SpotlightDirective } from '../../core/spotlight.directive';
import { CERTIFICATIONS, MARQUEE_SKILLS, SKILL_GROUPS } from '../../core/resume.data';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeadingComponent, RevealDirective, SpotlightDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class SkillsComponent {
  protected readonly groups = SKILL_GROUPS;
  protected readonly certifications = CERTIFICATIONS;

  /** Duplicated so the marquee can loop without a visible seam. */
  protected readonly marquee = [...MARQUEE_SKILLS, ...MARQUEE_SKILLS];
}
