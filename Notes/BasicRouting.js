const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Hello from server side.', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.status(201).json({ msg: 'Post created successfully.' });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
