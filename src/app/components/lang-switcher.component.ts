import { Component, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  template: `
    <div class="lang-switch">
      <button
        type="button"
        [class.active]="lang.lang() === 'hu'"
        (click)="lang.setLang('hu')"
      >
        Magyar
      </button>
      <button
        type="button"
        [class.active]="lang.lang() === 'en'"
        (click)="lang.setLang('en')"
      >
        English
      </button>
    </div>
  `,
})
export class LangSwitcherComponent {
  readonly lang = inject(LanguageService);
}
