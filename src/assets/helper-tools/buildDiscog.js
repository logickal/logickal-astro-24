import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { parse } from 'date-fns';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';


let discog = [];

async function initialBuild() {
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
        console.log(`Album: ${albumInfo.title} - Initial data run`);
        discog.push(albumInfo);
    });

    // Grab additional info from the JSON data:
    discog.forEach((album, index) => {
        console.log(`Updating album: ${album.title}`);
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

            // If the album is missing Apple/Spotify/Beatport URLs, search for them using the title
            if (!album.appleMusicUrl) {
                console.log(`Searching for Apple Music URL for ${album.title}`);
                album.appleMusicUrl = retrieveServiceUrl(album.title, 'apple', album.slug);
            }
            if (!album.spotifyUrl) {
                console.log(`Searching for Spotify URL for ${album.title}`);
                album.spotifyUrl = retrieveServiceUrl(album.title, 'spotify', album.slug);
            }
            if (!album.beatportUrl) {
                console.log(`Searching for Beatport URL for ${album.title}`);
                album.beatportUrl = retrieveServiceUrl(album.title, 'beatport', album.slug);
            }
            //write this entry back to the discog array
            console.log(`Updating album: ${album.title} - Final data run`);
            discog[index] = album;
        }

    });

    console.log('Data fetch done, returning');
    return discog;

}

async function retrieveServiceUrl(title, service, slug) {
    const searchString = `${title} logickal`;
    let searchSite = null;
    let albumDesignator = null;
    switch (service) {
        case 'spotify':
            searchSite = `open.spotify.com`;
            albumDesignator = 'album';
            break;
        case 'apple':
            searchSite = `music.apple.com`;
            albumDesignator = 'us/album';
            break;
        case 'beatport':
            searchSite =  `beatport.com`;
            albumDesignator = 'release';
            break;
        default:
            throw new Error('Invalid service');
    }

    let searchQuery = `site:${searchSite} ${searchString}`;


    let searchUrl = `https://www.google.com/search?q=${searchQuery}`;

   try {
    // retrieve the array of links from the google search results
    const data = await fetchGoogleResults(searchUrl);

    // Look for the link in the array that contains both the searchSite and the albumDesignator
    // console.log(`Title: ${title}`);
    const serviceLink = data.find(link => link.includes(searchSite) && link.includes(albumDesignator));

    console.log(`ServiceLink: ${serviceLink}`);

   }
   catch (err) {
       console.error(err);
   }


}
async function fetchGoogleResults(searchUrl) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.goto(searchUrl, {
        waitUntil: 'networkidle2', // Wait until the network is idle
        timeout: 60000 // Increase timeout to 60 seconds
    });

    const results = await page.content();
    const hrefs = await page.$$eval('a', as => as.map(a => a.href));
    await page.close();

    return hrefs;
}

//retrieveServiceUrl('Speaker Worship', 'apple', 'speaker-worship');

async function main() {
    try {
        console.log('Starting data build');
        let finalDiscog = await initialBuild();
        console.log('Data build complete');
    
        fs.writeFileSync(path.join(import.meta.dirname, 'src/assets/slimDiscog.json'), JSON.stringify(finalDiscog, null, 2));
        console.log('Data written to file');
    
    } catch (err) {
        console.error(err);
    }
}

main();