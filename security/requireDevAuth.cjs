const requireDevAuth = (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Basic ")) {
      res.set("WWW-Authenticate", 'Basic realm="Developer Dashboard"');
      return res.status(401).send("Authentication required.");
    }
    const [, base64] = auth.split(" ");
    const decoded = Buffer.from(base64, "base64").toString();
    const pass = decoded.includes(":") ? decoded.split(":")[1] : decoded;
    if (pass !== process.env.DASHBOARD_PASSWORD) {
      return res.status(403).send("Forbidden.");
    }
  }
  next();
};

module.exports = requireDevAuth;
