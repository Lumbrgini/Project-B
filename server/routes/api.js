import { Router } from 'express';
import { ObjectId } from 'mongodb';
import oAuthModel from '../oAuthModel.js';

const router  = Router();

router.get('/people', async (req, res) => {
  try {
    const db = req.app.get('db');
    const peopleCol = db.collection('user_auth');

    const docs = await peopleCol.find({}).toArray();

    const rows = docs.map(d => ({
      id: d._id.toString(),
      first_name: d.first_name,
      family_name: d.family_name,
      height: d.height,
      weight: d.weight,
      age: d.age,
      drinks: Array.isArray(d.drinks)
        ? d.drinks.map(drink => ({
          name: drink.name,
          timestamp: drink.timestamp,
          ingredients: Array.isArray(drink.ingredients)
            ? drink.ingredients.map(ing => ({
              volume: ing.volume,
              unit: ing.unit,
              abv: ing.abv,
            }))
            : [],
        }))
        : [],
    }));

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

router.get('/home', async (req, res) => {
  try {
    const db = req.app.get('db');
    const tokenString = req.headers.authorization?.split(' ')[1];
    if (!tokenString) return res.status(401).json({ error: 'UNAUTHORIZED' });

    // Use your OAuth model
    const model = oAuthModel(db);
    const token = await model.getAccessToken(tokenString);
    if (!token || !token.user) return res.status(401).json({ error: 'INVALID_TOKEN' });

    const user = token.user;

    // --- Corrected: use user.drinks ---
    const drinks = Array.isArray(user.drinks) ? user.drinks : [];
    const mappedDrinks = drinks.map(d => ({
      name: d.name,
      timestamp: d.timestamp,
      ingredients: Array.isArray(d.ingredients)
        ? d.ingredients.map(ing => ({
          volume: ing.volume,
          unit: ing.unit,
          abv: ing.abv,
        }))
        : [],
    }));

    res.json({
      id: user._id.toString(),
      first_name: user.first_name,      
      family_name: user.family_name,
      height: user.height,
      weight: user.weight,
      age: user.age,
      drinks: mappedDrinks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const db = req.app.get('db');
    const peopleCol = db.collection('user_auth');

    // --- Authorization ---
    const tokenString = req.headers.authorization?.split(' ')[1];
    if (!tokenString) return res.status(401).json({ error: 'UNAUTHORIZED' });

    const model = oAuthModel(db);
    const token = await model.getAccessToken(tokenString);
    if (!token || !token.user) return res.status(401).json({ error: 'INVALID_TOKEN' });

    const user = token.user;

    // --- Validation ---
    const { age, height, weight } = req.body;
    if (
      typeof age !== 'number' ||
      typeof height !== 'number' ||
      typeof weight !== 'number'
    ) {
      return res.status(400).json({ error: 'INVALID_INPUT' });
    }

    // --- Update ---
    const result = await peopleCol.updateOne(
      { _id: new ObjectId(user._id) },
      {
        $set: { age, height, weight, updatedAt: new Date() },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'USER_NOT_FOUND' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

router.post('/profile/drink', async (req, res) => {
  try {
    const db = req.app.get('db');
    const peopleCol = db.collection('user_auth');

    // --- Authorization ---
    const tokenString = req.headers.authorization?.split(' ')[1];
    if (!tokenString) return res.status(401).json({ error: 'UNAUTHORIZED' });

    const model = oAuthModel(db);
    const token = await model.getAccessToken(tokenString);
    if (!token || !token.user) return res.status(401).json({ error: 'INVALID_TOKEN' });

    const user = token.user;

    // --- Validation ---
    const { name, ingredients } = req.body;
    if (
      typeof name !== 'string' ||
      !Array.isArray(ingredients) ||
      ingredients.some(i =>
        typeof i.volume !== 'number' ||
        typeof i.unit !== 'string' ||
        typeof i.abv !== 'number',
      )
    ) {
      return res.status(400).json({ error: 'INVALID_INPUT' });
    }

    // --- Prepare new drink object ---
    const newDrink = {
      name,
      timestamp: new Date(), // current time
      ingredients: ingredients.map(i => ({
        volume: i.volume,
        unit: i.unit,
        abv: i.abv,
      })),
    };

    // --- Push to user's drinks array ---
    await peopleCol.updateOne(
      { _id: new ObjectId(user._id) },
      { $push: { drinks: newDrink }, $set: { updatedAt: new Date() } },
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

router.delete('/drinks/:timestamp', async (req, res) => {
  try {
    const db = req.app.get('db');
    const peopleCol = db.collection('user_auth');

    const tokenString = req.headers.authorization?.split(' ')[1];
    if (!tokenString) return res.status(401).json({ error: 'UNAUTHORIZED' });

    const model = oAuthModel(db);
    const token = await model.getAccessToken(tokenString);
    if (!token || !token.user) return res.status(401).json({ error: 'INVALID_TOKEN' });

    const user = token.user;

    const ts = req.params.timestamp;
    const tsDate = new Date(Number(ts)); 

    if (Number.isNaN(tsDate.getTime())) {
      return res.status(400).json({ error: 'INVALID_TIMESTAMP' });
    }

    // --- Pull drink by timestamp ---
    const result = await peopleCol.updateOne(
      { _id: new ObjectId(user._id) },
      { $pull: { drinks: { timestamp: tsDate } }, $set: { updatedAt: new Date() } }
    );

    return res.json({ ok: true, modified: result.modifiedCount });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});



export default router;