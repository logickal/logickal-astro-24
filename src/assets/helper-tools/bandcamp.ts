import scraper from 'bandcamp-scraper';
import fs from 'fs';

const getAlbumInfoPromise = (albumUrl: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    scraper.getAlbumInfo(albumUrl, (err: Error | null, albumInfo: unknown) => {
      if (err) {
        reject(err);
      } else {
        resolve(albumInfo);
      }
    });
  });
};

scraper.getAlbumUrls('https://logickal.bandcamp.com', (err: Error | null, albumUrls: string[]) => {
  if (err) {
    console.error(err);
    return;
  }

  const albumPromises = albumUrls.map((albumUrl) => getAlbumInfoPromise(albumUrl));

  Promise.all(albumPromises)
    .then((allAlbums) => {
      const jsonData = JSON.stringify(allAlbums, null, 2);
      fs.writeFile('allAlbums.json', jsonData, (writeErr) => {
        if (writeErr) {
          console.error('Error writing file:', writeErr);
        } else {
          console.log('Successfully wrote all album info to allAlbums.json');
        }
      });
    })
    .catch((error) => {
      console.error('Error fetching album info:', error);
    });
});
