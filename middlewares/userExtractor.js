

const jwt = require('jsonwebtoken');

// Este middleware extra el userId del json web token

module.exports = (req, resp, next) => {
   // Header de autorizacion
   const authorization = req.get(
      'authorization'
   );

   let token = null;
   if (
      authorization &&
      authorization
         .toLowerCase()
         .startsWith('bearer')
   ) {
      token = authorization.substring(7);
   }

   const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
   );


   if(!token || !decodedToken.id) {
      return resp.status(401).json({
         'Message': 'Token missing or invalid'
      });
   }

   // Saco el id del token, ya no se lo mando en el cuerpo
   const { id: userId } = decodedToken;
   req.userId = userId;


   next();
};