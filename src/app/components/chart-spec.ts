import type { Translations } from '../services/language.service';

export const TOPO_URL =
  'https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json';

export interface Tooltips {
  country: object;
  asr: object;
  processed: object;
  unprocessed: object;
  share: object;
  predicted: object;
  residual: object;
}

export function buildTooltips(t: Translations): Tooltips {
  return {
    country: { field: 'country', title: t.tt.country },
    asr: { field: 'melanoma_asr', title: t.tt.asr, format: '.2f' },
    processed: { field: 'processed_total_kg_per_cap', title: t.tt.processed, format: '.1f' },
    unprocessed: { field: 'non_processed_total', title: t.tt.unprocessed, format: '.1f' },
    share: { field: 'processed_share', title: t.tt.share, format: '.2f' },
    predicted: { field: 'predicted_asr', title: t.tt.predicted, format: '.2f' },
    residual: { field: 'residual', title: t.tt.residual, format: '+.2f' },
  };
}

export interface MapSpecOptions {
  domainMid?: number;
  reverse?: boolean;
  domain?: [number, number];
}

export function mapSpec(
  data: unknown[],
  field: string,
  scheme: string,
  legendTitle: string,
  tooltip: object[],
  opts: MapSpecOptions = {},
) {
  const scale: Record<string, unknown> = { scheme };
  if (opts.domainMid !== undefined) scale['domainMid'] = opts.domainMid;
  if (opts.reverse) scale['reverse'] = true;
  if (opts.domain) scale['domain'] = opts.domain;

  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 'container',
    height: 500,
    background: 'transparent',
    projection: { type: 'naturalEarth1' },
    data: { url: TOPO_URL, format: { type: 'topojson', feature: 'countries' } },
    transform: [
      {
        lookup: 'id',
        from: {
          data: { values: data },
          key: 'm49_int',
          fields: [
            'country',
            'iso3',
            'melanoma_asr',
            'processed_total_kg_per_cap',
            'non_processed_total',
            'processed_share',
            'predicted_asr',
            'residual',
          ],
        },
      },
    ],
    mark: { type: 'geoshape', stroke: '#ffffff', strokeWidth: 0.3 },
    encoding: {
      color: {
        condition: { test: `datum.${field} == null`, value: '#e6e6e3' },
        field,
        type: 'quantitative',
        scale,
        legend: { title: legendTitle, orient: 'bottom' },
      },
      tooltip,
    },
    config: { view: { stroke: null } },
  };
}

export const EMBED_OPTS = { actions: false, renderer: 'canvas' as const };
