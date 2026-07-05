const express = require('express');
const app = express();
const port = 3000;
const {seedData} = require('./db')

// Express simplifies routing by binding a path directly to an HTTP Method
app.get('/', (req, res) => {
  // Express automatically handles the standard 200 OK Status Code 
  // and formats the response Content-Type headers for you
  res.send('Hello World!');
});

app.get('/provinves', (req, res) => {
  // Express automatically handles the standard 200 OK Status Code 
  // and formats the response Content-Type headers for you
  res.json(seedData.provinces);
});

app.get('/provinves/:provice-id', (req, res) => {
  // Express automatically handles the standard 200 OK Status Code 
  // and formats the response Content-Type headers for you
  res.send('provinces');
});
app.get('/districts', (req, res) => {
  // Express automatically handles the standard 200 OK Status Code 
  // and formats the response Content-Type headers for you
  res.send('districts');
});

// app.get('/districts/:discrict-id', (req, res) => {
//   // Express automatically handles the standard 200 OK Status Code 
//   // and formats the response Content-Type headers for you
//   res.send('districts/:discrict-id');
// });
// app.get('/station', (req, res) => {
//   // Express automatically handles the standard 200 OK Status Code 
//   // and formats the response Content-Type headers for you
//   res.send('station');
// });

// app.get('/station:/station-id', (req, res) => {
//   // Express automatically handles the standard 200 OK Status Code 
//   // and formats the response Content-Type headers for you
//   res.send('station:/station-id');
// });
// app.get('/vehicle', (req, res) => {
//   // Express automatically handles the standard 200 OK Status Code 
//   // and formats the response Content-Type headers for you
//   res.send('vehicle');
// });

// app.get('/vehicle:/vehicle-id', (req, res) => {
//   // Express automatically handles the standard 200 OK Status Code 
//   // and formats the response Content-Type headers for you
//   res.send('vehicle:/vehicle-id');
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running at ${port} `);
});