var express = require('express');
var axios = require('axios');
var Last = require('../models/Last');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/last', function(req, res, next) {
  Last.find().limit(2).exec(function(err, lasts) {
    res.json(lasts);
  });

});


// https://imagesearch-kalunlee136.c9users.io/api/imagesearch/?search=lolcats&offset=0
router.get('/api/imagesearch/', function(req, res, next) {
  var search_query = req.query.search;
  var offset = req.query.offset || 0;
  
  var hist = '';
  
  if(offset > 0)
    hist = req.protocol + '://' + req.get('host') +'/api/imagesearch/?search='+ search_query + '&offset=' + offset;
  else
    hist = req.protocol + '://' + req.get('host') +'/api/imagesearch/?search='+ search_query;
  
  var newLast = new Last({'last_url': hist});
  newLast.save(function (err) {
    if (err)
      return err;
    console.log('done');
  });
  
  axios.get('https://api.imgur.com/3/gallery/search/top/'+offset+'/?q='+search_query, {
    headers: {
       Authorization: 'Client-ID 430f2186604735f',
       Accept: 'application/json'
    }
  })
  .then(function (response) {
     var pics = response.data.data.map(function (pic) { // image URLs, alt text and page urls
       return {"link":pic.link, "title": pic.title, "account_url": pic.account_url}
     })
     
     res.json({"data":pics});
  })
})
module.exports = router;
