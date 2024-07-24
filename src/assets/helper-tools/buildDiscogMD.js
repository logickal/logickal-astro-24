import fs from 'fs';
import path from 'path';

// Read the JSON file containing the discography
const albums = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'src/assets/allAlbums.json'), 'utf8'));

// Iterate over the retrieved albums
albums.forEach((album, index) => {
    // Create the Markdown content.  Replace this with real stuff later.
    const markdownContent = `---
    title: ${album.title.replace(/"/g, '\\"')}
    date: ${album.raw.current.release_date}
    tags: ${album.tags.map(tag => `${tag.name}`).join(', ')}
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

    // Write the Markdown content to a file

    const markdownFilename = `${album.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.mdx`;
    const outputPath = path.join(import.meta.dirname, 'src/pages/discography/raw', markdownFilename);
    fs.writeFileSync(outputPath, markdownContent);
});

console.log('Successfully wrote all album info to Markdown files in src/pages/discog/raw');