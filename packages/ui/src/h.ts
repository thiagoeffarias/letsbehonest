import { createElement } from 'react';
import type { ReactElement } from 'react';

/**
 * createElement com filhos permissivos: os componentes aceitam `Msg`
 * (stringKey, KeyRef, NumFormat) e traduzem-no internamente com `tr()`.
 */
export const h = createElement as unknown as (type: any, props?: any, ...children: any[]) => ReactElement;
