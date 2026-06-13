import { Component, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-intro',
  standalone: true,
  template: `
    @if (lang.lang() === 'hu') {
      <h1>Befolyásolja-e az étrendünk a bőrrák kockázatát?</h1>
      <p class="lede">
        Térképek és diagramok arról, hogy egy ország étrendje — különösen a feldolgozott
        élelmiszerek aránya — összefügg-e a melanóma 2022-es előfordulásával.
      </p>

      <section class="intro">
        <h2>Az adatokról</h2>
        <p>
          A <strong>bőrrákadatok</strong> a Global Cancer Observatory (GCO/IARC, a WHO része)
          forrásból származnak: életkorra standardizált bőrmelanóma-incidencia 100 000 lakosra
          vetítve, mindkét nem, 0–74 éves korosztály, 2022-es becslések.
        </p>
        <p>
          Az <strong>élelmiszer-fogyasztás</strong> a FAOSTAT Élelmiszerbeszerzési Mérlegéből
          (Food Balance Sheets, 2022) származik, egy főre jutó éves ellátásként kilogrammban
          kifejezve. Az országokat az ENSZ M49 numerikus országkódján kapcsoljuk össze.
        </p>
        <p>Minden ország étrendjét két azonos mértékegységű (kg/fő/év) kosárra bontjuk:</p>
        <ul>
          <li>
            <strong>Feldolgozott kosár</strong> — cukrok és édesítőszerek, növényi olajok,
            állati zsírok, vaj/ghee és alkoholos italok. Iparilag finomított vagy erjesztett
            termékek, amelyeknek nincs teljes értékű élelmiszer-megfelelője a FAO adatai
            között.
          </li>
          <li>
            <strong>Feldolgozatlan kosár</strong> — gabonafélék, gyümölcsök, zöldségek, hús,
            tej, hal és tenger gyümölcsei.
          </li>
        </ul>
        <p>
          A <em>feldolgozott arány</em> = feldolgozott ÷ (feldolgozott + feldolgozatlan)
          egyetlen mutatószámot ad országonként, amely 0 (tömeg szerint teljes egészében nyers
          élelmiszerek) és 1 (teljes egészében finomított termékek) között mozog.
        </p>
        <p>
          A harmadik térképen egyetlen globális egyenest illesztünk az összes országra —
          <span class="mono">melanoma_asr ≈ -2,74 + 0,0603 × processed_kg_per_capita</span> —
          és minden országot annak függvényében színezünk, hogy a tényleges értéke mennyivel
          tér el ettől a becsléstől.
        </p>
      </section>
    } @else {
      <h1>Does what we eat shape our risk of skin cancer?</h1>
      <p class="lede">
        Maps and charts exploring whether national diet — especially the share of processed
        foods — tracks with melanoma incidence in 2022.
      </p>

      <section class="intro">
        <h2>About the data</h2>
        <p>
          <strong>Skin cancer rates</strong> come from the Global Cancer Observatory
          (GCO/IARC, part of the WHO): age-standardized melanoma-of-skin incidence per
          100,000 people, both sexes, ages 0–74, 2022 estimates.
        </p>
        <p>
          <strong>Food consumption</strong> comes from FAOSTAT's Food Balance Sheets, 2022,
          reported as per-capita food supply in kilograms per person per year. Countries are
          joined on the UN M49 numeric country code.
        </p>
        <p>We split each country's diet into two baskets of the same unit (kg/capita/year):</p>
        <ul>
          <li>
            <strong>Processed basket</strong> — sugars &amp; sweeteners, vegetable oils,
            animal fats, butter/ghee, and alcoholic beverages. Industrially refined or
            fermented items with no whole-food analogue in the FAO data.
          </li>
          <li>
            <strong>Unprocessed basket</strong> — cereals, fruits, vegetables, meat, milk,
            fish &amp; seafood.
          </li>
        </ul>
        <p>
          The <em>processed share</em> = processed ÷ (processed + unprocessed) gives a single
          number per country that ranges from 0 (entirely whole foods, by mass) to 1 (entirely
          refined products).
        </p>
        <p>
          For the third map, we fit a single global line through all countries —
          <span class="mono">melanoma_asr ≈ -2.74 + 0.0603 × processed_kg_per_capita</span> —
          and color each country by how far its actual rate sits above or below that
          prediction.
        </p>
      </section>
    }
  `,
})
export class IntroComponent {
  readonly lang = inject(LanguageService);
}
