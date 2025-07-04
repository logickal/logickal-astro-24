import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface Album {
  title: string;
  [key: string]: any;
}

const discog: Album[] = [];
const csvData = Papa.parse<Album>(
  fs.readFileSync(path.join(__dirname, '../logickal-discog2.csv'), 'utf8'),
  { header: true }
);
const bandcampData: Album[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../allAlbums.json'), 'utf8')
);

csvData.data.forEach((album) => {
  const match = bandcampData.find((b) => b.title === album.title);
  if (match) {
    album.id = match.raw.current.id;
    album.credits = match.raw.current.credits;
    album.about = match.raw.current.about;
  }
  discog.push(album);
});

fs.writeFileSync(
  path.join(__dirname, '../logickal-discography.json'),
  JSON.stringify(discog, null, 2)
);
fs.writeFileSync(
  path.join(__dirname, '../logickal-discography.csv'),
  Papa.unparse(discog)
);
