/**
 * Contraste del formulario de registro en modo oscuro.
 *
 * 25-nov-2026: los textos de ayuda (.form-text) salían en el gris por defecto
 * de Bootstrap (#212529) sobre el fondo oscuro de la pagina (#0a0f2e): ratio
 * 1.21, ilegibles. Lo detectó Antonio con una captura del móvil.
 *
 * Estos tests calculan el ratio WCAG real contra el fondo de la pagina, para
 * que un cambio de tema no vuelva a dejar texto invisible.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// ── utilidades de contraste (WCAG 2.1) ──────────────────────────────────
function srgbToLinear(v) {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => srgbToLinear(parseInt(h.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a, b) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

// ── el CSS real ─────────────────────────────────────────────────────────
const THEME_CSS = fs.readFileSync(
  path.join(path.dirname(new URL(import.meta.url).pathname), 'theme.css'),
  'utf8',
);

// Los colores del tema, tal cual estan definidos.
const themeVars = Object.fromEntries(
  [...THEME_CSS.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]),
);

// El fondo real de la pagina de registro, medido con getComputedStyle sobre
// /registro en produccion el 25-nov-2026.
const PAGE_BACKGROUND = '#0a0f2e';

/** Color que aplica una regla [data-theme="dark"] <selector>. */
function colorFor(selector) {
  // Busca la regla cuya lista de selectores incluye el que se pide.
  const re = new RegExp(
    `\\[data-theme="dark"\\]\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`,
  );
  const m = THEME_CSS.match(re);
  if (!m) return null;
  const v = m[1].match(/color:\s*(#[0-9a-fA-F]{6}|var\(--[a-z-]+\))/);
  if (!v) return null;
  if (v[1].startsWith('var(')) {
    const name = v[1].replace(/var\(--([a-z-]+)\)/, '$1');
    return themeVars[name] || null;
  }
  return v[1];
}

describe('contraste del formulario en modo oscuro', () => {
  it('el CSS define color para .form-text (el texto de ayuda)', () => {
    // Sin esta regla, Bootstrap pone #212529 y el texto es invisible.
    expect(colorFor('.form-text')).not.toBeNull();
  });

  it('el texto de ayuda (.form-text) pasa el AA de WCAG sobre el fondo real', () => {
    const color = colorFor('.form-text');
    expect(color).not.toBeNull();
    const ratio = contrastRatio(color, PAGE_BACKGROUND);
    // AA para texto normal es 4.5. Antes daba 1.21.
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('los labels del formulario pasan el AA de WCAG', () => {
    const color = colorFor('.form-label');
    expect(color).not.toBeNull();
    expect(contrastRatio(color, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(4.5);
  });

  it('el mensaje de error de validacion pasa el AA de WCAG', () => {
    const color = colorFor('.invalid-feedback');
    expect(color).not.toBeNull();
    // El rojo de Bootstrap (#dc3545) daba 4.14: por debajo de AA.
    expect(contrastRatio(color, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(4.5);
  });

  it('el texto de los consentimientos (form-check-label) pasa el AA', () => {
    const color = colorFor('.form-check-label');
    expect(color).not.toBeNull();
    expect(contrastRatio(color, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(4.5);
  });

  it('el enlace dentro del texto de ayuda se distingue del texto que lo rodea', () => {
    const enlace = colorFor('.form-text a');
    const texto = colorFor('.form-text');
    expect(enlace).not.toBeNull();
    expect(enlace).not.toBe(texto);
    expect(contrastRatio(enlace, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(4.5);
  });

  it('ningun texto del formulario queda por debajo de AA', () => {
    for (const sel of ['.form-text', '.form-label', '.invalid-feedback', '.form-check-label']) {
      const color = colorFor(sel);
      expect(color, `${sel} sin color en modo oscuro`).not.toBeNull();
      const ratio = contrastRatio(color, PAGE_BACKGROUND);
      expect(ratio, `${sel} con ratio ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
