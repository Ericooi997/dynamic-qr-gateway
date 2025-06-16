export default function handler(req, res) {
  const SECRET_KEY = "yourSecretKey";
  const FIXED_CODE = "1390103";

  try {
    const token = req.query.token;
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const params = new URLSearchParams(decoded);

    const code = params.get('code');
    const timestamp = parseInt(params.get('t'));
    const sign = params.get('sign');

    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > 60) return res.status(403).send("Token expired.");

    const expectedSign = require("crypto")
      .createHash("sha256")
      .update(code + timestamp + SECRET_KEY)
      .digest("hex");

    if (sign !== expectedSign) return res.status(403).send("Invalid token.");

    console.log("✅ Access granted with code:", code);
    res.send("✅ Access granted. Door will open.");
  } catch (e) {
    res.status(500).send("Server error.");
  }
}

