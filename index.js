const express = require('express');
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/upload', (req, res) => {
  res.render('upload');
});

app.post('/bins', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    var saveTo = path.join(__dirname, 'uploads', `${Date.now()}_${filename}`);
    file.pipe(fs.createWriteStream(saveTo));
  });

  busboy.on('finish', function() {
    console.log('Done parsing form!');
    res.redirect('/');
  });
  
  req.pipe(busboy);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
