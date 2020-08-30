const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const cors = require('cors');
const sslRedirect = require('heroku-ssl-redirect');
const vhost = require('vhost');

const particles = express();
particles.use(express.static(path.join(__dirname, 'particles')));
particles.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'particles', 'index.html'));
});

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(sslRedirect());
// app.use(favicon(__dirname + 'things/build/favicon.ico'));
app.use(vhost('particles.kaelinhooper-things.herokuapp.com', particles));

app.get('/', (req, res) => res.send({ message: ':)' }))

app.listen(port, () => console.log(`Things app listening on port ${port}!`));

// https://stackoverflow.com/questions/5791260/how-can-i-configure-multiple-sub-domains-in-express-js-or-connect-js
// https://www.npmjs.com/package/vhost
