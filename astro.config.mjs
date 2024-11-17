import { readFileSync } from 'fs';
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import * as XLSX from 'xlsx';
import mdx from "@astrojs/mdx";
import favicons from "astro-favicons";
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';


import icon from 'astro-icon';


function excelDateToJSDate(serial) {

  if (typeof serial === 'object') {
    return new Date(serial);
  }
  
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);

  const fractional_day = serial - Math.floor(serial) + 0.0000001;

  let total_seconds = Math.floor(86400 * fractional_day);

  const seconds = total_seconds % 60;

  total_seconds -= seconds;

  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;


  return new Date(Date.UTC(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds));
}

const faviconsConfig = {
  masterPicture: "./src/assets/static-images/logickal-icon.png",
  emitAssets: true,
  faviconsDarkMode: true,

}

const sanityConf = {
  projectId: 'zbrphau8',
  dataset: 'production',
  useCdn: false,
  studioBasePath: '/admin',
};

// https://astro.build/config
export default defineConfig({
  site: 'https://logickalmusic.com',
  integrations: [tailwind(), mdx(), sanity(sanityConf), react(), favicons(faviconsConfig), partytown(), sitemap(), icon(
    {
      include: {
        "simple-icons": ["applemusic", "spotify", "bandcamp", "amazonmusic", "youtubemusic", "tidal", "soundcloud", "facebook", "instagram", "mastodon", "youtube", "twitch", "bluesky"]
      }
    }
  )],
  vite: {
    assetsInclude: ['**/*.numbers', '**/*.xlsx', '**/*.xls', '**/*.xlsb'],

    plugins: [
      {
        name: 'sheet-parser',
        transform(code, id) {
          if (id.endsWith('.numbers') || id.endsWith('.xlsx') || id.endsWith('.xls') || id.endsWith('.xlsb')) {
            //console.log('Parsing sheet', id);
            const workbook = XLSX.read(readFileSync(id));
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 0 });
            sheetData.forEach(row => {
              for (const key in row) {
                if (key === 'releaseDate') {
                  row[key] = excelDateToJSDate(row[key]);
                }
              }
            })
            return `export default ${JSON.stringify(sheetData)}`;
          }

      }
      }
    ]
  }
});