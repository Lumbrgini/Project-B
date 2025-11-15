import { Router } from "express";
import { ObjectId } from 'mongodb';

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

router.post("/people/add", async(req, res) => {
  const {id, name, drinks } = req.body;
  if (!id || !name || !drinks){
    return res.status(400).json({
       error: "ID, Name and drinks are required" 
    });
    // const created = await db.post.create({ data: { title }});

  }
   const created = {id: '3', 
      name: 'Paul', 
      drinks: [
        {
          drink_name: 'Beer',
          amount: 1.0
        }, 
        {
          drink_name: 'Jaegermeister',
          amount: 0.5,
        }
      ]};
    res.status(201).json(created);   
});

export default router;