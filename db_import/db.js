const mongoose = require('mongoose');
const Listing = require('../models/listing');

mongoose.connect('mongodb://heroku_cg23fj6g:fk35kvicjlju7t2mk6kotf2g07@ds157521.mlab.com:57521/heroku_cg23fj6g');


const lineReader = require('readline').createInterface({
  // input: require('fs').createReadStream('./sample.csv')
  input: require('fs').createReadStream('./SampleDataRio.csv'),
});

lineReader.on('line', (line) => {
  // console.log('Line from file:', line);
  const l = line.split(',');
  const r = {};
// id,  0
// ad_code, 1
// type_id, 2
// type, 3
  switch (l[3]) {
    case 'Apartamento': r.propertyType = 'apartment'; break;
    case 'Casa': r.propertyType = 'house'; break;
    default: r.propertyType = 'villa';
  }

  // ptype_id, 4
  // st_name, 5
  r.street = l[5];
  // st_no, 6
  r.streetNumber = l[6];
  // cep, 7
  r.zip = l[7];
  // neigh, 8
  r.neighbourhood = l[8];
  // city, 9
  r.city = l[9];
  // state, 10
  r.state = l[10];
  // area, 11
  r.size = l[11];
  // price, 12
  r.price = l[12];
  // pricesqm, 13
  if (r.price < 100000) {
    r.listingType = 'rental';
  } else {
    switch (Math.floor(Math.random() * 2)) {
      case 0: r.listingType = 'sale'; break;
      case 1: r.listingType = 'new'; break;
    }
  }

  r.priceSqm = l[13];
  // bed, 14
  r.bedrooms = l[14];
  // bath, 15
  r.bathrooms = l[15];
  // suite, 16
  r.suites = l[16];
  // parking, 17
  r.parking = l[17];
  // image_count, 18
  // latitude, 19
  // longitude, 20
  r.location = {
    type: 'Point',
    coordinates: [l[20], l[19]],
  };

  // accuracy, 21
  r.accuracy = l[21];
  // image_name 22

  r.photos = [`https://media.agenteimovel.com.br/images/${l[22]}`];

  const listing = new Listing(r);

  listing.save((err) => {
    if (err) console.log(err);
  });
});
