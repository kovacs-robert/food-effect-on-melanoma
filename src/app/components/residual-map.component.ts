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
  selector: 'app-residual-map',
  standalone: true,
  template: `
    <section>
      <h2>
        {{ lang.lang() === 'hu'
          ? '5. Hol „magyarázza\" az étrend a rákadatokat – és hol nem?'
          : '5. Where does diet "explain" cancer rates — and where doesn\\'t it?' }}
      </h2>
      <div #host class="map"></div>
      @if (lang.lang() === 'hu') {
        <p class="caption">
          A globális lineáris illesztés utáni reziduális ASR a feldolgozott
          élelmiszerbevitelhez képest. A <strong>piros</strong> országokban <em>több</em> a
          melanóma, mint amennyit az étrend önmagában megjósolna (jellemzően erős
          UV-sugárzású vagy világos bőrű népességű országok: Ausztrália, Új-Zéland,
          skandináv országok). A <strong>kék</strong> országokban <em>kevesebb</em>. A szürke
          országok nem szerepelnek az összevont adathalmazban.
        </p>
      } @else {
        <p class="caption">
          Residual ASR after the global linear fit on processed-food intake.
          <strong>Red</strong> countries have <em>more</em> melanoma than diet alone would
          predict (typically high-UV or fair-skinned populations: Australia, NZ, Nordics).
          <strong>Blue</strong> countries have <em>less</em>. Grey countries are not in the
          joined dataset.
        </p>
      }
    </section>
  `,
})
export class ResidualMapComponent implements AfterViewInit, OnDestroy {
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
      'residual',
      'redblue',
      t.legend.residual,
      [
        TT.country,
        TT.asr,
        TT.processed,
        TT.unprocessed,
        TT.share,
        TT.predicted,
        TT.residual,
      ],
      { reverse: true, domainMid: 0 },
    );
    this.view?.finalize();
    const el = this.host().nativeElement;
    el.innerHTML = '';
    const result = await embed(el, spec as object, EMBED_OPTS);
    this.view = result.view;
  }
}
