import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  DEFAULT_LOCALE, KEY_RE, LOCALES, MESSAGES, formatNumber, localeFromPath, localePath, resolve as resolveMsg, translate,
} from '../src/i18n';

const placeholders = (s: string) => (s.match(/\{\w+\}/g) || []).sort();

describe('catálogos', () => {
  const base = MESSAGES[DEFAULT_LOCALE];
  for (const l of LOCALES) {
    it(`${l.value} tem as mesmas chaves e placeholders que ${DEFAULT_LOCALE}`, () => {
      const m = MESSAGES[l.value];
      expect(Object.keys(m).sort()).toEqual(Object.keys(base).sort());
      for (const k of Object.keys(base)) expect(placeholders(m[k]), k).toEqual(placeholders(base[k]));
    });
    it(`${l.value}: todas as chaves são válidas e nenhum valor está vazio`, () => {
      for (const [k, v] of Object.entries(MESSAGES[l.value])) {
        expect(KEY_RE.test(k), k).toBe(true);
        expect(v.trim().length, k).toBeGreaterThan(0);
      }
    });
  }
});

describe('chaves usadas no código existem', () => {
  const src = resolve(__dirname, '../src');
  const files: string[] = [];
  (function walk(d: string) {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.tsx?$/.test(f) && !p.includes('/i18n/')) files.push(p);
    }
  })(src);
  const namespaces = new Set(Object.keys(MESSAGES.pt_pt).map((k) => k.split('.')[0]));
  const keys = Object.keys(MESSAGES.pt_pt);

  it('cada literal com forma de stringKey resolve (ou é prefixo de chaves dinâmicas)', () => {
    const missing: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, 'utf8');
      for (const m of text.matchAll(/'([a-z][a-zA-Z0-9_]*(?:\.[a-zA-Z0-9_]+)+\.?)'/g)) {
        const k = m[1];
        if (!namespaces.has(k.split('.')[0])) continue;
        const ok = k.endsWith('.') ? keys.some((x) => x.startsWith(k)) : keys.includes(k);
        if (!ok) missing.push(`${f.replace(src, '')}: ${k}`);
      }
    }
    expect(missing).toEqual([]);
  });
});

describe('tradução e formatação', () => {
  it('chave em falta aparece como ⟦chave⟧', () => {
    expect(translate('pt_pt', 'nao.existe')).toBe('⟦nao.existe⟧');
  });
  it('en cai para pt_pt quando a chave não existe em en', () => {
    const saved = MESSAGES.en['nav.map'];
    delete MESSAGES.en['nav.map'];
    expect(translate('en', 'nav.map')).toBe(MESSAGES.pt_pt['nav.map']);
    MESSAGES.en['nav.map'] = saved;
  });
  it('números seguem o idioma', () => {
    expect(formatNumber('pt_pt', { num: 5192, f: 'eurM2' })).toBe('5 192 €/m²');
    expect(formatNumber('en', { num: 5192, f: 'eurM2' })).toBe('€5,192/m²');
    expect(formatNumber('pt_pt', { num: 12.5, f: 'pct', d: 1, sign: true })).toBe('+12,5%');
    expect(formatNumber('en', { num: -3, f: 'pct' })).toBe('−3%');
  });
  it('resolve aceita chave, {k,p}, número e texto cru', () => {
    expect(resolveMsg('en', 'nav.map')).toBe(MESSAGES.en['nav.map']);
    expect(resolveMsg('pt_pt', { k: 'params.years', p: { n: 30 } })).toContain('30');
    expect(resolveMsg('pt_pt', 'Lisboa')).toBe('Lisboa');
    expect(resolveMsg('pt_pt', 'T2')).toBe('T2');
  });
});

describe('URL', () => {
  it('/ é pt_pt e /en/ é en', () => {
    expect(localeFromPath('/')).toBe('pt_pt');
    expect(localeFromPath('/calculadora')).toBe('pt_pt');
    expect(localeFromPath('/en')).toBe('en');
    expect(localeFromPath('/en/calculadora')).toBe('en');
    expect(localeFromPath('/english')).toBe('pt_pt');
  });
  it('localePath alterna o prefixo', () => {
    expect(localePath('en', '/calculadora')).toBe('/en/calculadora');
    expect(localePath('pt_pt', '/en/calculadora')).toBe('/calculadora');
    expect(localePath('en', '/')).toBe('/en/');
    expect(localePath('pt_pt', '/en')).toBe('/');
  });
});
