const express = require('express');
const app = express();
const port = 3000;

// Express simplifies routing by binding a path directly to an HTTP Method
app.get('/', (req, res) => {
  // Express automatically handles the standard 200 OK Status Code 
  // and formats the response Content-Type headers for you
  res.send('Hello World!');
});