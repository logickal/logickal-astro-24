import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { parse } from 'date-fns';

let discog = [];

function initialBuild() {
    const bandcampData = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'src/assets/allAlbums.json'), 'utf8'));
    const csvData = Papa.parse(fs.readFileSync(path.join(import.meta.dirname, 'src/assets/logickal-discog.csv'), 'utf8'), { header: true });

        // Build the initial discography object from the csv:
    csvData.data.forEach((album, index) => {
        let albumInfo = {
            title: album.title.replace(/"/g, '\\"'),
            releaseDate: album.releaseDate,
            slug: album.slug,
            //tags: album.tags,
            //id: album.id,
            imageUrl: album.coverUrl,
            bandcampUrl: album.bandcampUrl,
            spotifyUrl: album.spotifyUrl,
            appleMusicUrl: album.appleMusicUrl,
            beatportUrl: album.beatportUrl,
    //      credits: album.credits,
    //      about: album.about
            blurb: album.blurb,
            label: album.label,
            labelUrl: album.labelUrl
        };

        discog.push(albumInfo);
    });

    // Grab additional info from the JSON data:
    discog.forEach((album, index) => {
        // Find the matching album in the bandcamp data
        let match = bandcampData.find(bandcampAlbum => bandcampAlbum.title === album.title);
        // We specifically want to populate the tags, id, credits, and about fields
        if (match) {
            album.tags = match.tags;
            album.id = match.raw.current.id;
            album.credits = match.raw.current.credits;
            album.about = match.raw.current.about;
            // if the album is missing a bandcampURL, grab it from the bandcampData
            if (!album.bandcampUrl) {
                album.bandcampUrl = match.url;
            }
            //write this entry back to the discog array
            discog[index] = album;
        }

    });

}

initialBuild();
fs.writeFileSync(path.join(import.meta.dirname, 'src/assets/slimDiscog.json'), JSON.stringify(discog, null, 2));