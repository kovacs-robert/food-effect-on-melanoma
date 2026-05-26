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
import { EMBED_OPTS, buildTooltips, mapSpec } from './chart-spec';

@Component({
  selector: 'app-cancer-map',
  standalone: true,
  template: `
    <section>
      <h2>
        {{ lang.lang() === 'hu'
          ? '1. Hol a legmagasabb a bőrrák előfordulása'
          : '1. Where skin cancer hits hardest' }}
      </h2>
      <div #host class="map"></div>
      <p class="caption">
        {{ lang.lang() === 'hu'
          ? 'Életkorra standardizált bőrmelanóma-incidencia, 100 000 lakosra vetítve. Sötétebb = magasabb arány. Forrás: GCO/IARC, 2022.'
          : 'Age-standardized melanoma-of-skin incidence, per 100,000 people. Darker = higher rate. Source: GCO/IARC, 2022.' }}
      </p>
    </section>
  `,
})
export class CancerMapComponent implements AfterViewInit, OnDestroy {
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
    const spec = mapSpec(
      COUNTRY_DATA,
      'melanoma_asr',
      'yelloworangered',
      t.legend.cancer,
      [TT.country, TT.asr],
    );
    this.view?.finalize();
    const el = this.host().nativeElement;
    el.innerHTML = '';
    const result = await embed(el, spec as object, EMBED_OPTS);
    this.view = result.view;
  }
}
