import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import { parse } from 'date-fns';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface Album {
  [key: string]: any;
}

let discog: Album[] = [];

async function initialBuild(): Promise<Album[]> {
  const bandcampData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'src/assets/allAlbums.json'), 'utf8')
  );
  const csvData = Papa.parse<Album>(
    fs.readFileSync(path.join(__dirname, 'src/assets/logickal-discog.csv'), 'utf8'),
    { header: true }
  );

  csvData.data.forEach((album) => {
    const albumInfo: Album = {
      title: album.title.replace(/"/g, '\\"'),
      releaseDate: album.releaseDate,
      slug: album.slug,
      imageUrl: album.coverUrl,
      bandcampUrl: album.bandcampUrl,
      spotifyUrl: album.spotifyUrl,
      appleMusicUrl: album.appleMusicUrl,
      beatportUrl: album.beatportUrl,
      blurb: album.blurb,
      label: album.label,
      labelUrl: album.labelUrl,
    };
    console.log(`Album: ${albumInfo.title} - Initial data run`);
    discog.push(albumInfo);
  });

  discog.forEach((album, index) => {
    console.log(`Updating album: ${album.title}`);
    const match = bandcampData.find((b: Album) => b.title === album.title);
    if (match) {
      album.tags = match.tags;
      album.id = match.raw.current.id;
      album.credits = match.raw.current.credits;
      album.about = match.raw.current.about;
      if (!album.bandcampUrl) {
        album.bandcampUrl = match.url;
      }
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
      console.log(`Updating album: ${album.title} - Final data run`);
      discog[index] = album;
    }
  });

  console.log('Data fetch done, returning');
  return discog;
}

async function retrieveServiceUrl(title: string, service: string, slug: string): Promise<string | undefined> {
  const searchString = `${title} logickal`;
  let searchSite: string | null = null;
  let albumDesignator: string | null = null;
  switch (service) {
    case 'spotify':
      searchSite = 'open.spotify.com';
      albumDesignator = 'album';
      break;
    case 'apple':
      searchSite = 'music.apple.com';
      albumDesignator = 'us/album';
      break;
    case 'beatport':
      searchSite = 'beatport.com';
      albumDesignator = 'release';
      break;
    default:
      throw new Error('Invalid service');
  }

  const searchQuery = `site:${searchSite} ${searchString}`;
  const searchUrl = `https://www.google.com/search?q=${searchQuery}`;

  try {
    const data = await fetchGoogleResults(searchUrl);
    const serviceLink = data.find((link) => link.includes(searchSite!) && link.includes(albumDesignator!));
    console.log(`ServiceLink: ${serviceLink}`);
    return serviceLink;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

async function fetchGoogleResults(searchUrl: string): Promise<string[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  );
  await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });

  await page.content();
  const hrefs = await page.$$eval('a', (as) => as.map((a) => (a as HTMLAnchorElement).href));
  await page.close();

  return hrefs;
}

async function main() {
  try {
    console.log('Starting data build');
    const finalDiscog = await initialBuild();
    console.log('Data build complete');

    fs.writeFileSync(
      path.join(__dirname, 'src/assets/slimDiscog.json'),
      JSON.stringify(finalDiscog, null, 2)
    );
    console.log('Data written to file');
  } catch (err) {
    console.error(err);
  }
}

main();
