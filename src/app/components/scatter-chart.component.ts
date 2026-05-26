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
  selector: 'app-scatter-chart',
  standalone: true,
  template: `
    <section>
      <h2>
        {{ lang.lang() === 'hu'
          ? '4. Étrend és melanóma: szóródási diagram regressziós egyenessel'
          : '4. Diet and melanoma: scatter plot with regression line' }}
      </h2>
      <div #host class="map"></div>
      @if (lang.lang() === 'hu') {
        <p class="caption">
          Minden pont egy ország. A vízszintes tengelyen a feldolgozott élelmiszer mennyisége
          (kg/fő/év), a függőlegesen a melanóma ASR. A piros egyenes a globális lineáris
          illesztés: <span class="mono">y ≈ -2,74 + 0,0603 × x</span>. A vonaltól való
          függőleges távolság a reziduális érték — a pontok színe is ezt jelzi (piros =
          a becsültnél magasabb ASR).
        </p>
      } @else {
        <p class="caption">
          Each dot is a country. The x-axis is processed food intake (kg/cap/year); the
          y-axis is melanoma ASR. The red line is the global linear fit:
          <span class="mono">y ≈ -2.74 + 0.0603 × x</span>. Vertical distance from the line is
          the residual — dot color encodes the same (red = higher ASR than predicted).
        </p>
      }
    </section>
  `,
})
export class ScatterChartComponent implements AfterViewInit, OnDestroy {
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
      height: 480,
      background: 'transparent',
      data: { values: COUNTRY_DATA },
      layer: [
        {
          mark: {
            type: 'circle',
            size: 80,
            opacity: 0.78,
            stroke: '#ffffff',
            strokeWidth: 0.5,
          },
          encoding: {
            x: {
              field: 'processed_total_kg_per_cap',
              type: 'quantitative',
              title: t.axis.xProcessed,
              scale: { nice: true },
            },
            y: {
              field: 'melanoma_asr',
              type: 'quantitative',
              title: t.axis.yAsr,
            },
            color: {
              field: 'residual',
              type: 'quantitative',
              scale: { scheme: 'redblue', reverse: true, domainMid: 0 },
              legend: { title: t.legend.scatter, orient: 'bottom' },
            },
            tooltip: [TT.country, TT.processed, TT.asr, TT.predicted, TT.residual],
          },
        },
        {
          transform: [
            { regression: 'melanoma_asr', on: 'processed_total_kg_per_cap' },
          ],
          mark: { type: 'line', color: '#b34747', strokeWidth: 2 },
          encoding: {
            x: { field: 'processed_total_kg_per_cap', type: 'quantitative' },
            y: { field: 'melanoma_asr', type: 'quantitative' },
          },
        },
      ],
      config: { view: { stroke: null } },
    };

    this.view?.finalize();
    const el = this.host().nativeElement;
    el.innerHTML = '';
    const result = await embed(el, spec as object, EMBED_OPTS);
    this.view = result.view;
  }
}
