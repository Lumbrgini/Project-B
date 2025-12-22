import oAuthModel from "../oAuthModel.js";

export default function authMiddleware(db) {
  const model = oAuthModel(db);

  return async (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
      }

      const tokenString = header.split(" ")[1];
      const token = await model.getAccessToken(tokenString);

      if (!token || !token.user) {
        return res.status(401).json({ error: "INVALID_TOKEN" });
      } 

      req.user = {
        id: token.user._id,
        username: token.user.username,
      };

      next();
    } catch (err) {
      console.error("Auth error:", err);
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }
  };
}
