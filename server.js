const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/connections/db');
const userRoutes = require('./src/routes/userRoutes.js');
const articleRoutes = require('./src/routes/articleRoutes.js');
const Routes = require('./src/routes/index.js');
const path = require('path');
const { error } = require('console');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname,'src' ,'uploads')));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.use('/api',Routes)

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB()
});

server.on('error',(error) => {
  console.error("server error:",error.message);
})


module.exports = app;
