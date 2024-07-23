import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'src/assets/allAlbums.json'), 'utf8'));

let discog = [];

data.forEach((album, index) => {
    let albumInfo = {
        title: album.title.replace(/"/g, '\\"'),
        date: album.raw.current.release_date,
        tags: album.tags.map(tag => `${tag.name}`).join(', '),
        id: album.raw.current.id,
        imageUrl: album.imageUrl,
        url: album.url,
        spotifyUrl: '',
        appleMusicUrl: '',
        credits: album.raw.current.credits,
        about: album.raw.current.about
    };

    discog.push(albumInfo);
});

fs.writeFileSync(path.join(import.meta.dirname, 'src/assets/slimDiscog.json'), JSON.stringify(discog, null, 2));