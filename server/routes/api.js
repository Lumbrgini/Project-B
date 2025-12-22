import { Router } from "express";
import { ObjectId } from 'mongodb';
import authMiddleware from "../middleware/auth.js";

const router  = Router();

router.get("/api/people", async (req, res) => {
  try {
    const db = req.app.get("db");              
    const peopleCol = db.collection("users"); 

    const docs = await peopleCol
      .find({})
      .project({})
      .toArray();

    const rows = docs.map(d => ({
      id: d._id.toString(),
      name: d.name,
      height: d.height,
      weight: d.weight,
      age: d.age,
      drink: d.drink.map(([name, timeStamp, ...rest]) => {
        let iso = null;

        if(timeStamp && timeStamp._bsontype === "Timestamp"){
          const seconds = timeStamp.getHighBits();
          iso = new Date(seconds * 1000).toISOString();
        };

        const ingridients = rest
          .map(([amount, alcdegree]) => ({
            amount,
            alcdegree
          }));

        return {
          name,
          date: iso,
          ingridients
        };
      })
    }));

    res.json(rows);
  } catch(err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/api/home", async (req, res) => {

  try {
    const db = req.app.get("db");              
    const peopleCol = db.collection("user_auth"); 

    const docs = await peopleCol
      .find({})
      .project({})
      .toArray();

    const rows = docs.map(d => ({
      id: d._id.toString(),
      name: d.name,
      height: d.height,
      weight: d.weight,
      age: d.age,
      drink: d.drink.map(([name, timeStamp, ...rest]) => {
        let iso = null;

        if(timeStamp && timeStamp._bsontype === "Timestamp"){
          const seconds = timeStamp.getHighBits();
          iso = new Date(seconds * 1000).toISOString();
        };

        const ingridients = rest
          .map(([amount, alcdegree]) => ({
            amount,
            alcdegree
          }));

        return {
          name,
          date: iso,
          ingridients
        };
      })
    }));

    res.json(rows);
  } catch(err) {
    console.error(err);
    res.status(500).send();
  }
});


router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const db = req.app.get("db");
    const userId = req.user.id;

    const { age, height, weight } = req.body;

    if (
      typeof age !== "number" ||
      typeof height !== "number" ||
      typeof weight !== "number"
    ) {
      return res.status(400).json({ error: "INVALID_INPUT" });
    }

    const result = await db.collection("user").updateOne(
      { _id: userId },
      {
        $set: {
          age,
          height,
          weight,
        },
      }
    );

    if (result.matchedCount !== 1) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
});

export default router;