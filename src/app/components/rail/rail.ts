import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NAV_LINKS } from '../../core/resume.data';
import { ScrollService } from '../../core/scroll.service';

/** Fixed dot navigation down the left edge, shown on wide screens only. */
@Component({
  selector: 'app-rail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="rail" aria-label="Section navigation">
      @for (link of links; track link.id) {
        <button
          type="button"
          class="rail__dot"
          [class.is-active]="scroll.activeSection() === link.id"
          (click)="scroll.scrollTo(link.id)"
          [attr.aria-current]="scroll.activeSection() === link.id ? 'true' : null"
          [attr.aria-label]="'Go to ' + link.label">
          <span class="rail__tip" aria-hidden="true">{{ link.label }}</span>
        </button>
      }
    </nav>
  `,
  styleUrl: './rail.scss',
})
export class RailComponent {
  protected readonly links = NAV_LINKS;
  protected readonly scroll = inject(ScrollService);
}
