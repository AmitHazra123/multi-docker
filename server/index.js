const keys = require('./keys');
const Numbers = require('./models/Numbers');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const mongoose = require('mongoose');

mongoose.connect(keys.mongoUri, {useNewUrlParser: true, useUnifiedTopology: true}, oError => {
  if(oError) {
    console.log(oError);
  } else {
    console.log("mongodb connected!");
  }
});

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, res) => {
  res.send('Hi');
});

app.get('/values/all', async (req, res) => {
  Numbers.find().then(numbers => res.status(200).send({data: numbers})).catch(oError => res.status(400).send({error: oError}));
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    if(err)
      res.status(400).send({error: err});
    else
      res.status(200).send({data: values});
  });
});

app.post('/values', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  
  const newNumber = new Numbers({numberindex: index});
  newNumber.save().then(numbers => res.status(200).send({data: numbers})).catch(oError => res.status(400).send({error: oError}));
});

app.listen(5000, err => {
  console.log('Listening');
});
