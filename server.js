const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/connections/db');
const userRoutes = require('./src/routes/userRoutes.js');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
