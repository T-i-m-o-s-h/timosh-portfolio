import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MagneticDirective } from '../../core/magnetic.directive';
import { PROFILE } from '../../core/resume.data';
import { ScrollService } from '../../core/scroll.service';

/** Splits a word into characters so each can animate on its own delay. */
function chars(word: string): readonly string[] {
  return Array.from(word);
}

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticDirective],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent {
  protected readonly profile = PROFILE;
  protected readonly scroll = inject(ScrollService);

  protected readonly lineOne = chars('FULL');
  protected readonly lineTwo = chars('STACK');
  protected readonly lineThree = chars('DEVELOPER');

  /** Staggered delay in ms — lines cascade, characters inside them ripple. */
  protected delay(line: number, index: number): string {
    return `${420 + line * 130 + index * 34}ms`;
  }
}
