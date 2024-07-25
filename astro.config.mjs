import { readFileSync } from 'fs';
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import * as XLSX from 'xlsx';
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx()],
  vite: {
    assetsInclude: ['**/*.numbers', '**/*.xlsx', '**/*.xls', '**/*.xlsb'],

    plugins: [
      {
        name: 'sheet-parser',
        transform(code, id) {
          if (id.endsWith('.numbers') || id.endsWith('.xlsx') || id.endsWith('.xls') || id.endsWith('.xlsb')) {
            console.log('Parsing sheet', id);
            const workbook = XLSX.read(readFileSync(id));
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 0 });
            return `export default ${JSON.stringify(sheetData)}`;
          }

      }
      }
    ]
  }
});