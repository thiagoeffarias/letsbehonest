import type { Suggestion } from '@preco-real/ui';
import type { Dataset, Zone } from './data';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export interface Hit {
  zone: Zone;
  suggestion: Suggestion;
}

/** Procura por nome (sem acentos); concelhos primeiro, depois freguesias com dados. */
export function searchZones(data: Dataset, query: string, limit = 6): Hit[] {
  const q = norm(query);
  if (q.length < 2) return [];
  const label = (z: Zone) => (z.level === 'freguesia' ? `${z.name}, ${data.byCode.get(z.parent ?? '')?.name ?? ''}` : z.name);
  const score = (z: Zone) => {
    const n = norm(z.name);
    return n === q ? 0 : n.startsWith(q) ? 1 : n.split(/[\s-]+/).some((w) => w.startsWith(q)) ? 2 : n.includes(q) ? 3 : 9;
  };
  return [...data.concelhos, ...data.freguesias]
    .filter((z) => z.code !== 'PT')
    .map((z) => ({ z, s: score(z) + (z.level === 'freguesia' ? 0.5 : 0) }))
    .filter((x) => x.s < 9)
    .sort((a, b) => a.s - b.s || a.z.name.localeCompare(b.z.name, 'pt'))
    .slice(0, limit)
    .map(({ z }) => ({
      zone: z,
      suggestion: { label: label(z), kind: z.level === 'freguesia' ? 'zonekind.parish' : 'zonekind.municipality' },
    }));
}
