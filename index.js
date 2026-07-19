require('dotenv').config();
const express = require('express');
const app = express();

const { connectDB } = require('./db');

const ProvincesRouter = require('./router/provinces');
const DistrictRouter = require('./router/districts');
const StationsRouter = require('./router/stations');
const VehicleRouter = require('./router/vehicles');
const PingsRouter = require('./router/pings');
const AuthRouter = require('./router/auth');


const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    session: 'NB6007CEMS2'
  });
});

app.use('/v1/api/provinces', ProvincesRouter);
app.use('/v1/api/districts', DistrictRouter);
app.use('/v1/api/stations', StationsRouter);
app.use('/v1/api/vehicles', VehicleRouter);
app.use('/v1/api/pings', PingsRouter);
app.use('/v1/api/auth', AuthRouter);

// Connect to MongoDB first; only start accepting requests once it succeeds.
async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running at ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB. Server not started.', err);
    process.exit(1);
  }
}

startServer();