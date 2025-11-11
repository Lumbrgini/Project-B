import express from 'express';
import { v4 } from 'uuid'

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const db = req.app.get('db');
    // TODO: validate req.body (email)
    const insertion = await db.collection('user_auth').insertOne({ username: req.body.email });
    if (insertion.acknowledged) {
      const token = v4();
      const tokenInsertion = await db.collection('token').insertOne({
        emailToken: token,
        emailTokenExpiresAt: new Date(Date.now() + (1000 * 60 * 60)), // now plus 60 minutes
        user_id: insertion.insertedId,
      });

      if (tokenInsertion.acknowledged) {
        // TODO: send url with token by email instead of logging it to console
        console.log(`Activation link: http://localhost:3000/activate/${token}`);

        res.status(201).send();
      } else {
        res.status(500).send();
      }
    } else {
      res.status(500).send();
    }
  } catch(err) {
    console.error(err);
    res.status(500).send();
  }
});

export default router;
