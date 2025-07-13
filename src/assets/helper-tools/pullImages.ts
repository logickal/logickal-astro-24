import * as XLSX from 'xlsx';
import axios from 'axios';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

interface Row {
  imageUrl: string;
  slug: string;
  title: string;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

function pullImages() {
  const xlsFile = join(__dirname, '../logickal-discography-FINAL.xlsx');
  console.log(`Reading file: ${xlsFile}`);
  const workbook = XLSX.read(readFileSync(xlsFile));
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const sheetData = XLSX.utils.sheet_to_json<Row>(sheet, { header: 0 });

  sheetData.forEach(async (row) => {
    try {
      console.log('Fetching');
      const response = await axios.get(row.imageUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      const extension = row.imageUrl.split('.').pop();
      const fileName = `${row.slug}-cover.${extension}`;
      const filePath = join(__dirname, '../coverImg', fileName);
      writeFileSync(filePath, buffer);
      console.log(`Successfully pulled image for ${row.title}`);
    } catch (error) {
      console.error(`Error pulling image for ${row.title}: ${error}`);
    }
  });
}

pullImages();
