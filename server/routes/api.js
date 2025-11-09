import { Router } from "express";

const router  = Router();

const testington1 = {
  id: 1,
  name: "Tester Testington1",
  drinks: [
    {
      name: "Mystery Mix",
      ingredients: [
        {
          volume: "0.25",
          unit: "ml",
          abv: "0",
        },
        {
          volume: "0.25",
          unit: "ml",
          abv: "30",
        }
      ],
      crates: 0.41666
    },
    {
      name: "Mystery Mix 2",
      ingredients: [
        {
          volume: "0.25",
          unit: "ml",
          abv: "0",
        },
        {
          volume: "0.25",
          unit: "ml",
          abv: "30",
        }
      ],
      crates: 0.41666
    }
  ]
}

const testington2 = {
  id: 2,
  name: "Tester Testington2",
  drinks: [
    {
      name: "Beer",
      ingredients: [{
          volume: "0.33",
          unit: "ml",
          abv: "5",
      }],
      crates: 0.41666
    }
  ]
}


/**
 * GET /people
 * Returns information on all people.
 */
router.get("/people", async (req, res) => {
  const rows = [ testington1, testington2 ];
  res.json(rows);
});



/**
 * POST /people/add
 * Adds a new person
 */
router.post("/people/add", async(req, res) => {
  const {id, name, drinks } = req.body;
  if (!id || !name || !drinks){
    return res.status(400).json({ error: "ID, Name and drinks are required" });
  }
  // const created = await db.post.create({ data: { title }});
  const created = testington;
  res.status(201).json(created);   
});


/**
 * GET /api/dash/:id
 * Returns all information related to a person by ID.
 */
router.get("/dash/:id", async(req, res) => {
  try{
    const { id } = req.params;

    // Basic validation - gpt code might suck
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid person ID format' });
    }
      
    // const person = await Person.findById(id)
    const person = testington1;
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.status(200).json(person); 
  }catch(e){
    console.log(e)
  }
  
});


/**
 * Post /api/drink/add
 * Adds a new drink
 */
router.post("/drink/add", async(req, res) => {
  try{
    const { drinkName, ingredients, crates } = req.body;
    if (!drinkName || !ingredients || !crates){
      return res.status(400).json({
        error: "Incomplete Request" 
      });
    }
    // const created = await db.post.create({ data: { title }});
    const drink = {
      name: drinkName, 
      ingredients: ingredients,
      cratesValue: crates  
    };
    console.log(drink)
    res.status(201).json(drink);   
  }catch(e){
    console.log(e)
  }
});

export default router;