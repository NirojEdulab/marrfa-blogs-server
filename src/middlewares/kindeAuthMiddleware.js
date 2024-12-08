const jwt = require('jsonwebtoken');
const axios = require('axios');

const kindeAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    const kindePublicKeyUrl = "https://marrfablogs.kinde.com/.well-known/jwks.json";

    const response = await axios.get(kindePublicKeyUrl);
    const publicKeys = response.data.keys;

    console.log("publicKeys==>> ", publicKeys);
    

    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader || !decodedHeader.header.kid) {
      return res.status(401).json({ message: 'Invalid token: Missing "kid" in header' });
    }

    const key = publicKeys.find(k => k.kid === decodedHeader.header.kid);
    if (!key || !key.x5c || key.x5c.length === 0) {
      return res.status(401).json({ message: 'Invalid token: No matching public key found' });
    }

    console.log("key==>> ", key);


    const publicKey = `-----BEGIN CERTIFICATE-----\n${key.x5c[0]}\n-----END CERTIFICATE-----`;

    const verifiedPayload = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      audience: 'https://marrfablogs.kinde.com/api',
      issuer: 'https://marrfablogs.kinde.com/',
    });

    console.log("verifiedPayload==>>> ", verifiedPayload);
    

    req.user = verifiedPayload;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = kindeAuthMiddleware;
