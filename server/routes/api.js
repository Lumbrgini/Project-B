import { Router } from "express";

const router  = Router();

router.get("/people", async (req, res) => {
  const rows = [{ 
      id: '1', 
      name: 'Bella', 
      drinks: [
        {
          drink_name: 'Cider',
          amount: 0.5
        }, 
        {
          drink_name: 'Jaegermeister',
          amount: 0.2,
        }
      ]
    },
    {
      id: '2', 
      name: 'Victoria', 
      drinks: [
        {
          drink_name: 'Cider',
          amount: 1.0
        }, 
        {
          drink_name: 'Jaegermeister',
          amount: 0.5,
        }
      ]
    },
  ];
  res.json(rows);
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