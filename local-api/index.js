const express = require('express');
const request = require('request');
const cherio = require('cherio');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: true,
  })
);

app.get('/', (req, res) => {
  res.send({ response: 'Hello World!' });
});

app.post('/', async (req, res) => {
  const { link } = req.body;

  const urls = [];

  request(link, async (err, response, html) => {
    if (!err && response.statusCode === 200) {
      console.log('Success!');
      const $ = await cherio.load(html);

      await $('img').each((i, img) => {
        const image = $(img).attr('src');
        urls.push(image);
        // console.log(image);
      });
      res.send(urls);
    } else {
      console.log('Failed');
      res.status(400).send('There is an error!');
    }
  });
});

app.listen(8080, () => console.log('Listening to port 8080'));
