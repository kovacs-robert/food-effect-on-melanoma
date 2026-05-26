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
  selector: 'app-diet-map',
  standalone: true,
  template: `
    <section>
      <h2>
        {{ lang.lang() === 'hu'
          ? "2. Mennyire feldolgozott az egyes országok étrendje?"
          : "2. How processed is each country's diet?" }}
      </h2>
      <div #host class="map"></div>
      <p class="caption">
        {{ lang.lang() === 'hu'
          ? 'A nyomon követett élelmiszer-ellátás feldolgozott aránya tömeg szerint. Sötétebb kék = feldolgozottabb. Forrás: FAOSTAT FBS, 2022.'
          : 'Processed share of tracked food supply, by mass. Darker blue = more processed. Source: FAOSTAT FBS, 2022.' }}
      </p>
    </section>
  `,
})
export class DietMapComponent implements AfterViewInit, OnDestroy {
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
      'processed_share',
      'blues',
      t.legend.diet,
      [TT.country, TT.processed, TT.unprocessed, TT.share],
    );
    this.view?.finalize();
    const el = this.host().nativeElement;
    el.innerHTML = '';
    const result = await embed(el, spec as object, EMBED_OPTS);
    this.view = result.view;
  }
}
