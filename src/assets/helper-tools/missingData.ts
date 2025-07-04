import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface Album {
  title: string;
  [key: string]: any;
}

const albums: Album[] = JSON.parse(
  fs.readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/assets/slimDiscog.json'),
    'utf8'
  )
);

const data: { title: string; missingFields: string[] }[] = [];

albums.forEach((album) => {
  const missingFields: string[] = [];
  for (const [key, value] of Object.entries(album)) {
    if (!value) {
      missingFields.push(key);
    }
  }
  data.push({ title: album.title, missingFields });
});

console.log(data);
