import express from 'express';
import bodyParser from 'body-parser';
import fetch from "node-fetch";

const PORT = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve file
app.get('/', (req, res) => {
  res.render('index');
});


// Api endpoint
app.post("/api/recommend-songs", async (req, res) => {
  let id = req.body.id ? req.body.id : "2396871";
  const url = `https://genius-song-lyrics1.p.rapidapi.com/song/recommendations/?id=${id}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '22b14cf32fmshc138374033472c9p1952c0jsnff439f7a8bb5',
      'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
    }
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const songs = [];
    result.song_recommendations.recommendations.forEach((prop) => {
      const temp = prop.recommended_song;
      const obj = {
        title: temp.title,
        title_featured: temp.title_with_featured,
        thumbnail: temp.song_art_image_thumbnail_url,
        release_date: temp.release_date_for_display,
        url: temp.url,
        id: temp.id,
      }
      songs.push(obj);
    });
    res.render('includes/recommendation', { songs });
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT);

console.log(`http://localhost:${PORT}/`);
