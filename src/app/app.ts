import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BackgroundComponent } from './components/background/background';
import { CursorComponent } from './components/cursor/cursor';
import { NavComponent } from './components/nav/nav';
import { PreloaderComponent } from './components/preloader/preloader';
import { RailComponent } from './components/rail/rail';
import { AboutComponent } from './sections/about/about';
import { ContactComponent } from './sections/contact/contact';
import { ExperienceComponent } from './sections/experience/experience';
import { HeroComponent } from './sections/hero/hero';
import { ProjectsComponent } from './sections/projects/projects';
import { SkillsComponent } from './sections/skills/skills';
import { ScrollService } from './core/scroll.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PreloaderComponent,
    BackgroundComponent,
    CursorComponent,
    NavComponent,
    RailComponent,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Instantiated here so scroll tracking starts with the shell, not on first read.
  private readonly scroll = inject(ScrollService);
}
