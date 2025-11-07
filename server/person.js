import express from 'express';

const router = express.Router();

const app = express();
const port = 3000;

const userData = [
  { id: '1', name: 'Bella', drinks: [{
      drink_name: 'Cider',
      amount: 0.5
    }, 
    {
      drink_name: 'Jaegermeister',
      amount: 0.2,
    }]
  },

  { id: '2', 
    name: 'Victoria', 
    drinks: 
    [{
      drink_name: 'Cider',
      amount: 1.0
    }, 
    {
      drink_name: 'Jaegermeister',
      amount: 0.5,
    }]
  },
];

router.get('/', (req, res) => {
  res.json(userData);
});

router.get('/:id', (req, res) => {
  const user = userData.find(u => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send();
  }
});

export default router;
