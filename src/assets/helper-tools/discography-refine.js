import fs from 'fs';
import path from 'path';
import { parse } from 'date-fns';
import Papa from 'papaparse';

// Read the csv generated from the latest version of the xls file.
let discog = [];
const csvData = Papa.parse(fs.readFileSync(path.join(import.meta.dirname, '../logickal-discog2.csv'), 'utf8'), { header: true });
const bandcampData = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '../allAlbums.json'), 'utf8'));

// Grab the text data from the bandcamp data
csvData.data.forEach((album, index) => {
    let match = bandcampData.find(bandcampAlbum => bandcampAlbum.title === album.title);
    if (match) {
        album.id = match.raw.current.id;
        album.credits = match.raw.current.credits;
        album.about = match.raw.current.about;
    }
    discog.push(album);
});

fs.writeFileSync(path.join(import.meta.dirname, '../logickal-discography.json'), JSON.stringify(discog, null, 2));
//also write a csv version
fs.writeFileSync(path.join(import.meta.dirname, '../logickal-discography.csv'), Papa.unparse(discog));