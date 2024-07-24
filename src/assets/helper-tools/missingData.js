import fs from 'fs';
import path from 'path';

// Read the JSON file containing the discography
const albums = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'src/assets/slimDiscog.json'), 'utf8'));

let data = [];
// Iterate over the retrieved albums, generating an object with the album title and a list of fields in the original object that are empty.
albums.forEach((album, index) => {
    let missingFields = [];
    for (const [key, value] of Object.entries(album)) {
        if (!value) {
            missingFields.push(key);
        }
    }
    data.push({ title: album.title, missingFields: missingFields });
});

console.log(data);
