import express from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

router.post("/", async (req, res) => {
  try {
    const db = req.app.get("db");
    const { firstName, familyName, email, password } = req.body;

    if (!firstName?.trim() || !familyName?.trim()) {
      return res.status(400).json({ error: "NAME_REQUIRED" });
    }

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: "INVALID_EMAIL" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const exists = await db.collection("user_auth").findOne({ username: normalizedEmail });
    if (exists) {
      return res.status(409).json({ error: "EMAIL_ALREADY_EXISTS" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const insertion = await db.collection("user_auth").insertOne({
      first_name: firstName.trim(),
      family_name: familyName.trim(),
      username: normalizedEmail,
      password: passwordHash,
      drink: [],
      age: null,
      height: null,
      weight: null,
    });

    const token = uuidv4();
    const tokenInsertion = await db.collection("token").insertOne({
      emailToken: token,
      emailTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
      user_id: insertion.insertedId, 
    });

    if (!tokenInsertion.acknowledged) {
      return res.status(500).json({ error: "TOKEN_CREATE_FAILED" });
    }

    console.log(`Activation link: http://localhost:3000/activate/${token}`);

    return res.status(201).json({ ok: true }); 
  } catch (err) {

    if (err?.code === 11000) {
      return res.status(409).json({ error: "EMAIL_ALREADY_EXISTS" });
    }
    console.error(err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
});

router.put("/:token", async (req, res) => {
  try {
    const db = req.app.get("db");

    const token = await db.collection("token").findOne({ emailToken: req.params.token });
    if (!token) return res.status(401).json({ error: "INVALID_TOKEN" });

    if (t.emailTokenExpiresAt < new Date()) {
      await db.collection("token").deleteOne({ emailToken: req.params.token });
      return res.status(410).json({ error: "TOKEN_EXPIRED" });
    }

    const { firstName, familyName, password } = req.body;

    const userInsertion = await db.collection("user").insertOne({
      first_name: firstName.trim(),
      family_name: familyName.trim(),
      permissions: { write: false },
      createdAt: new Date(),
    });

    const passwordHash = await bcrypt.hash(password, 10);

    const updated = await db.collection("user_auth").updateOne(
      { _id: token.user_id }, 
      {
        $set: {
          password: passwordHash,
          user_id: userInsertion.insertedId, 
          is_active: true,
        },
      }
    );

    if (updated.modifiedCount !== 1) {
      return res.status(500).json({ error: "ACTIVATION_FAILED" });
    }

    await db.collection("token").deleteOne({ emailToken: req.params.token });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
});

export default router;
