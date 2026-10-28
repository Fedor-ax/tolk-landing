import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Часть картинок — декор с геометрией макета (арочная маска, аватар,
    // абсолютная скоба): next/image навесил бы свою обёртку и сломал её.
    files: ['src/components/landing2/**/*.tsx'],
    rules: { '@next/next/no-img-element': 'off' },
  },
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts']),
]);
