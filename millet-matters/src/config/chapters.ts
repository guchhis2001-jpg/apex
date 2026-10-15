import theme from './theme.json';

/**
 * The four Transformation chapters.
 * Frames live at  /assets/sequences/{id}/0001.webp … {frames}.webp  (4-digit, 1-based).
 * Mobile draws every `mobileStep`th frame. Set `mobileVideo` to an MP4 to use video on phones instead.
 * Colours come from src/config/theme.json → chapters.
 */
export interface Chapter {
  id: 'pancake' | 'khichdi' | 'dosa' | 'cookie';
  word: string;
  grain: string;
  lines: string[];
  products: string[]; // first purchasable handle is featured
  frames: number;
  ext: 'webp' | 'avif' | 'jpg';
  mobileStep: number;
  mobileVideo: string | null;
  before: string;
  after: string;
  bg: string;
  ink: string;
  accent: string;
  wordColor: string;
}

const c = theme.chapters;
const base = { frames: 60, ext: 'webp' as const, mobileStep: 2, mobileVideo: null };

export const CHAPTERS: Chapter[] = [
  {
    ...base, id: 'pancake', word: 'Pancake', grain: 'Jowar + Foxtail',
    lines: ['Pancakes.', 'Minus the maida.'],
    products: ['double-chocochip-millet-pancake-mix'],
    before: 'Raw jowar + foxtail', after: 'Sunday, sorted',
    bg: c.pancake.bg, ink: c.pancake.ink, accent: c.pancake.accent, wordColor: c.pancake.word,
  },
  {
    ...base, id: 'khichdi', word: 'Khichdi', grain: 'Kodo',
    lines: ['One pot.', 'Ten minutes.', 'Actual comfort.'],
    products: ['millet-instant-khichdi-mix'],
    before: 'Raw kodo', after: 'Dinner, done',
    bg: c.khichdi.bg, ink: c.khichdi.ink, accent: c.khichdi.accent, wordColor: c.khichdi.word,
  },
  {
    ...base, id: 'dosa', word: 'Dosa', grain: 'Little Millet',
    lines: ['Crisp, golden,', 'millet all the', 'way through.'],
    products: ['millet-instant-dosa-mix'],
    before: 'Raw little millet', after: 'Crisp, as promised',
    bg: c.dosa.bg, ink: c.dosa.ink, accent: c.dosa.accent, wordColor: c.dosa.word,
  },
  {
    ...base, id: 'cookie', word: 'Cookie', grain: 'Ragi',
    lines: ['The 4pm snack,', 'upgraded.'],
    products: ['ragi-cookies', 'multi-millet-almond-cashew-cookies'],
    before: 'Raw ragi', after: '4pm, handled',
    bg: c.cookie.bg, ink: c.cookie.ink, accent: c.cookie.accent, wordColor: c.cookie.word,
  },
];

export const frameUrl = (ch: Chapter, i: number) => `/assets/sequences/${ch.id}/${String(i + 1).padStart(4, '0')}.${ch.ext}`;
