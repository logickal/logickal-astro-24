import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface Album {
  title: string;
  raw: { current: { release_date: string; id: string; credits: string; about: string } };
  tags: { name: string }[];
  imageUrl: string;
  url: string;
}

const albums: Album[] = JSON.parse(
  fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/assets/allAlbums.json'), 'utf8')
);

albums.forEach((album) => {
  const markdownContent = `---
    title: ${album.title.replace(/"/g, '\\"')}
    date: ${album.raw.current.release_date}
    tags: ${album.tags.map((tag) => `${tag.name}`).join(', ')}
    id: ${album.raw.current.id}
    imageUrl: ${album.imageUrl}
    url: ${album.url}
    spotifyUrl:
    appleMusicUrl:
    ---


    ### Credits
    ${album.raw.current.credits}

    ### Album Info
    ${album.raw.current.about}

    `;

  const markdownFilename = `${album.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.mdx`;
  const outputPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'src/pages/discography/raw',
    markdownFilename
  );
  fs.writeFileSync(outputPath, markdownContent);
});

console.log('Successfully wrote all album info to Markdown files in src/pages/discog/raw');
