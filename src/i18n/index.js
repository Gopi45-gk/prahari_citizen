import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import mr from './locales/mr.json';
import bn from './locales/bn.json';
import gu from './locales/gu.json';
import pa from './locales/pa.json';
import or from './locales/or.json';
import as from './locales/as.json';
import ur from './locales/ur.json';
import sa from './locales/sa.json';
import kok from './locales/kok.json';
import mni from './locales/mni.json';
import ne from './locales/ne.json';
import brx from './locales/brx.json';
import doi from './locales/doi.json';
import ks from './locales/ks.json';
import mai from './locales/mai.json';
import sat from './locales/sat.json';
import sd from './locales/sd.json';
import bho from './locales/bho.json';
// Let's fallback to hi for bho in case bho.json isn't there, or I can generate it.
// Actually, in the generate script, bho wasn't in translations.js. So bho.json is missing!
// I'll create an empty one or copy hi.json for bho.json

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ta: { translation: ta },
  te: { translation: te },
  kn: { translation: kn },
  ml: { translation: ml },
  mr: { translation: mr },
  bn: { translation: bn },
  gu: { translation: gu },
  pa: { translation: pa },
  or: { translation: or },
  as: { translation: as },
  ur: { translation: ur },
  sa: { translation: sa },
  kok: { translation: kok },
  mni: { translation: mni },
  ne: { translation: ne },
  brx: { translation: brx },
  doi: { translation: doi },
  ks: { translation: ks },
  mai: { translation: mai },
  sat: { translation: sat },
  sd: { translation: sd },
  bho: { translation: bho }
};

const savedLanguage = localStorage.getItem("prahari_language") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
