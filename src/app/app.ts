import { Component, OnInit, inject } from '@angular/core';
import { LanguageService } from './services/language.service';
import { LangSwitcherComponent } from './components/lang-switcher.component';
import { IntroComponent } from './components/intro.component';
import { CancerMapComponent } from './components/cancer-map.component';
import { DietMapComponent } from './components/diet-map.component';
import { ResidualMapComponent } from './components/residual-map.component';
import { ScatterChartComponent } from './components/scatter-chart.component';
import { BarChartComponent } from './components/bar-chart.component';
import { SiteFooterComponent } from './components/site-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LangSwitcherComponent,
    IntroComponent,
    CancerMapComponent,
    DietMapComponent,
    ResidualMapComponent,
    ScatterChartComponent,
    BarChartComponent,
    SiteFooterComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly lang = inject(LanguageService);

  ngOnInit(): void {
    this.lang.setLang('hu');
  }
}
