import { Injectable, computed, signal } from '@angular/core';

export type Lang = 'hu' | 'en';

export interface Translations {
  pageTitle: string;
  tt: {
    country: string;
    asr: string;
    processed: string;
    unprocessed: string;
    share: string;
    predicted: string;
    residual: string;
  };
  legend: {
    cancer: string;
    diet: string;
    residual: string;
    scatter: string;
  };
  axis: {
    xProcessed: string;
    yAsr: string;
  };
}

const I18N: Record<Lang, Translations> = {
  hu: {
    pageTitle: 'Étrend és bőrrák — globális kitekintés',
    tt: {
      country: 'Ország',
      asr: 'Melanóma ASR (100 ezerre)',
      processed: 'Feldolgozott (kg/fő/év)',
      unprocessed: 'Feldolgozatlan (kg/fő/év)',
      share: 'Feldolgozott arány',
      predicted: 'Becsült ASR',
      residual: 'Reziduális ASR',
    },
    legend: {
      cancer: 'Melanóma ASR 100 ezer lakosra',
      diet: 'Feldolgozott élelmiszerek aránya (sötétebb = feldolgozottabb)',
      residual: 'Reziduális ASR (piros = több rák, mint amit az étrend megjósol)',
      scatter: 'Reziduális ASR',
    },
    axis: {
      xProcessed: 'Feldolgozott élelmiszer (kg/fő/év)',
      yAsr: 'Melanóma ASR (100 ezerre)',
    },
  },
  en: {
    pageTitle: 'Diet vs Skin Cancer — A Global View',
    tt: {
      country: 'Country',
      asr: 'Melanoma ASR (per 100k)',
      processed: 'Processed (kg/cap/yr)',
      unprocessed: 'Unprocessed (kg/cap/yr)',
      share: 'Processed share',
      predicted: 'Predicted ASR',
      residual: 'Residual ASR',
    },
    legend: {
      cancer: 'Melanoma ASR per 100,000',
      diet: 'Processed share of food supply (darker = more processed)',
      residual: 'Residual ASR (red = more cancer than diet predicts)',
      scatter: 'Residual ASR',
    },
    axis: {
      xProcessed: 'Processed food (kg/cap/yr)',
      yAsr: 'Melanoma ASR (per 100k)',
    },
  },
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly _lang = signal<Lang>('hu');

  readonly lang = this._lang.asReadonly();
  readonly t = computed(() => I18N[this._lang()]);

  setLang(lang: Lang) {
    if (!I18N[lang]) return;
    this._lang.set(lang);
    document.documentElement.lang = lang;
    document.title = I18N[lang].pageTitle;
  }
}
