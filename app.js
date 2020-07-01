const express = require('express');
const request = require('request');
const path = require('path');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


//query tv shows
app.get('/search_tvshow', (req, res) => {
  console.log(req.query.show);

  let show = req.query.show;
  request(
    { url: 'http://api.tvmaze.com/search/shows?q='+show },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }
    
      res.json(JSON.parse(body));
    }
  )
});


//get single tv show
app.get('/shows', (req, res) => {
  console.log(req.query);
  let id = req.query.id;
  let season_number = req.query.season_number;
  let episode_number = req.query.episode_number;
  let url;


  if (req.query.seasons === "GET" && !episode_number) {
     // just get season api
     url = `http://api.tvmaze.com/shows/${id}/seasons`;
     
  }else if (episode_number){

     //get episode number api
     url = `http://api.tvmaze.com/shows/${id}/episodebynumber?season=${season_number}&number=${episode_number}`
  }else{

    //get single show api
    url = `http://api.tvmaze.com/shows/${id}`
    console.log("reg");
  }


  request(
    { url: url },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }
      res.json(JSON.parse(body));
    }
  )
});


const PORT = 4001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));