import scraper from 'bandcamp-scraper';
import fs from 'fs';

const getAlbumInfoPromise = (albumUrl) => {
  return new Promise((resolve, reject) => {
	scraper.getAlbumInfo(albumUrl, (err, albumInfo) => {
	  if (err) {
		reject(err);
	  } else {
		resolve(albumInfo);
	  }
	});
  });
};

scraper.getAlbumUrls('https://logickal.bandcamp.com', function(err, albumUrls) {
  if (err) {
	console.error(err);
	return;
  }
  
  const albumPromises = albumUrls.map(albumUrl => getAlbumInfoPromise(albumUrl));
  
  Promise.all(albumPromises)
	.then(allAlbums => {
	  const jsonData = JSON.stringify(allAlbums, null, 2);
	  fs.writeFile('allAlbums.json', jsonData, (err) => {
		if (err) {
		  console.error('Error writing file:', err);
		} else {
		  console.log('Successfully wrote all album info to allAlbums.json');
		}
	  });
	})
	.catch(error => {
	  console.error('Error fetching album info:', error);
	});
});