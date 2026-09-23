import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from '../../core/reveal.directive';
import { ScrambleDirective } from '../../core/scramble.directive';

@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, ScrambleDirective],
  template: `
    <header class="heading">
      <span class="eyebrow" appReveal>
        <span appScramble>{{ index() }} / {{ label() }}</span>
      </span>
      <h2 class="heading__title" [appReveal]="90">{{ title() }}</h2>
      @if (lede()) {
        <p class="heading__lede" [appReveal]="180">{{ lede() }}</p>
      }
    </header>
  `,
  styleUrl: './section-heading.scss',
})
export class SectionHeadingComponent {
  readonly index = input.required<string>();
  readonly label = input.required<string>();
  readonly title = input.required<string>();
  readonly lede = input<string>('');
}
