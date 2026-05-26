import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import embed, { Result } from 'vega-embed';
import { LanguageService } from '../services/language.service';
import { COUNTRY_DATA } from '../data/country-data';
import { EMBED_OPTS, buildTooltips } from './chart-spec';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: `
    <section>
      <h2>
        {{ lang.lang() === 'hu'
          ? '2. A 20 legmagasabb melanóma-incidenciájú ország'
          : '2. Top 20 countries by melanoma incidence' }}
      </h2>
      <div #host class="map"></div>
      <p class="caption">
        {{ lang.lang() === 'hu'
          ? 'Életkorra standardizált bőrmelanóma-incidencia szerinti rangsor (csökkenő sorrend). A skála ugyanaz, mint az 1. térképen. Forrás: GCO/IARC, 2022.'
          : 'Ranked by age-standardized melanoma-of-skin incidence, descending. Color scale matches map 1. Source: GCO/IARC, 2022.' }}
      </p>
    </section>
  `,
})
export class BarChartComponent implements AfterViewInit, OnDestroy {
  readonly lang = inject(LanguageService);
  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');
  private view?: Result['view'];
  private ready = false;

  constructor() {
    effect(() => {
      this.lang.lang();
      if (this.ready) this.render();
    });
  }

  ngAfterViewInit(): void {
    this.ready = true;
    this.render();
  }

  ngOnDestroy(): void {
    this.view?.finalize();
  }

  private async render() {
    const t = this.lang.t();
    const TT = buildTooltips(t);
    const spec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 520,
      background: 'transparent',
      data: { values: COUNTRY_DATA },
      transform: [
        {
          window: [{ op: 'rank', as: 'rank' }],
          sort: [{ field: 'melanoma_asr', order: 'descending' }],
        },
        { filter: 'datum.rank <= 20' },
      ],
      mark: { type: 'bar', cornerRadiusEnd: 2 },
      encoding: {
        y: {
          field: 'country',
          type: 'nominal',
          sort: '-x',
          title: null,
          axis: { labelFontSize: 12 },
        },
        x: {
          field: 'melanoma_asr',
          type: 'quantitative',
          title: t.axis.yAsr,
        },
        color: {
          field: 'melanoma_asr',
          type: 'quantitative',
          scale: { scheme: 'yelloworangered' },
          legend: null,
        },
        tooltip: [TT.country, TT.asr, TT.processed, TT.share, TT.residual],
      },
      config: { view: { stroke: null } },
    };

    this.view?.finalize();
    const el = this.host().nativeElement;
    el.innerHTML = '';
    const result = await embed(el, spec as object, EMBED_OPTS);
    this.view = result.view;
  }
}
