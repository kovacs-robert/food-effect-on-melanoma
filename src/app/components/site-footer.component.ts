import { Component, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  template: `
    <footer>
      @if (lang.lang() === 'hu') {
        <span>
        Polacsek Péter, Kovács Róbert, 2024. A bőrrák és az étrend összefüggései.
        </span>
      } @else {
        <span>
        Péter Polacsek, Róbert Kovács, 2024. The relationship between skin cancer and diet.
        </span>
      }
    </footer>
  `,
})
export class SiteFooterComponent {
  readonly lang = inject(LanguageService);
}
