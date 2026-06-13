import { Component, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  template: `
    <footer>
      @if (lang.lang() === 'hu') {
        <span>
       
        </span>
      } @else {
        <span>
   
        </span>
      }
    </footer>
  `,
})
export class SiteFooterComponent {
  readonly lang = inject(LanguageService);
}
