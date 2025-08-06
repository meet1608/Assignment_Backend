const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/connections/db');
const userRoutes = require('./src/routes/userRoutes.js');
const articleRoutes = require('./src/routes/articleRoutes.js');
const path = require('path');
const { error } = require('console');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

});

server.on('error',(error) => {
  console.error("server error:",error.message);
})


module.exports = app;
