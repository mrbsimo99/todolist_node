require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./api/routes/auth');
const todoRoutes = require('./api/routes/todos');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => res.send('Server attivo'));

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connesso'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`));
