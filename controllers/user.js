const jwt = require('jsonwebtoken');

const express = require('express');
const handleErrors = require('../middlewares/handleErrors');


const userRouter = express.Router();
const User = require('../models/User');
const userExtractor = require('../middlewares/userExtractor');
const Post = require('../models/Post');




// Crear nuevo usuario
userRouter.post('/new', async(req, resp, next) => {
   try {
      const { username } = req.body;
      const newUser = new User({
         username
      });

      const savedUser = await newUser.save();


      const userForToken = {
         id: savedUser._id
      };


      const token = jwt.sign(
         userForToken,
         process.env.JWT_SECRET
      );

      resp.status(200).json({ 
         savedUser,
         token
      });
   }
   catch(err) {
      next(err);
   }
});


// Obtener info de un usuario
userRouter.get('/:id', async(req, resp, next) => {
   try {
      const { id } = req.params;
      
      const user = await User.findById(id);
      const userPosts = await Post.find({
         userFeed: user._id
      }).sort({'createdAt': -1 });

      resp.status(200).json({
         user,
         posts: userPosts
      });
   }
   catch(err) {
      next(err);
   }
});



userRouter.delete('/:id', userExtractor, async(req, resp, next) => {
   try {
      const { id } = req.params;
      
      if(id !== req.userId) {
         return resp.status(401).json({ Message: 'Insufficient permissions'});
      }


      await User.findByIdAndDelete(req.userId);
      resp.status(204).send('Deleted');
   }
   catch(err){
      next(err);
   }

});


userRouter.use(handleErrors);
module.exports = userRouter;