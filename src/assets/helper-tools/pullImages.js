import * as XLSX from 'xlsx';
import axios from 'axios';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

function pullImages() {
    const xlsFile = join(import.meta.dirname, '../logickal-discography-FINAL.xlsx');
    console.log(`Reading file: ${xlsFile}`);
    const workbook = XLSX.read(readFileSync(xlsFile));
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    console.log(sheet);
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 0 });
    console.log(sheetData);
    sheetData.forEach(async row => {
        try {
            console.log('Fetching');
            // Pull the image from the URL
            const response = await axios.get(row.imageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');

            // Build the filename with extension
            const extension = row.imageUrl.split('.').pop();
            const fileName = `${row.slug}-cover.${extension}`;
            const filePath = join(import.meta.dirname, '../coverImg', fileName);
            console.log(filePath);
            // Write the image to the file system
            writeFileSync(filePath, buffer);
            console.log(`Successfully pulled image for ${row.title}`);
        } catch (error) {
            console.error(`Error pulling image for ${row.title}: ${error}`);
        }
    });
}

pullImages();