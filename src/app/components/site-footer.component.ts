import { Component, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  template: `
    <footer>
      @if (lang.lang() === 'hu') {
        <span>
          Forrás: <span class="mono">country_food_melanoma_2022.csv</span> (162 ország). A
          vizualizációk Vega-Lite használatával készültek.
        </span>
      } @else {
        <span>
          Generated from <span class="mono">country_food_melanoma_2022.csv</span> (162
          countries). Visualizations rendered with Vega-Lite.
        </span>
      }
    </footer>
  `,
})
export class SiteFooterComponent {
  readonly lang = inject(LanguageService);
}
