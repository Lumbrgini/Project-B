import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/api', (req, res) => {
  res.json({
    sucess: true,
  });
});

app.use(express.static('index.html'));
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


