


const express = require('express');
const handleErrors = require('../middlewares/handleErrors');
const userExtractor = require('../middlewares/userExtractor');
const Post = require('../models/Post');
const User = require('../models/User');


const postRouter = express.Router();


// Add new post 
postRouter.post('/', async(req, resp, next) => {
   try {
      const data = req.body;
      const { userId, ...rest } = data;

      // Check if user exists
      const user = await User.findById(userId);      
      if(!user) {
         return resp.send(400).json({ Message: 'User not found'});
      }

      // Save new post in DB
      const newPost = new Post({
         userFeed: userId,
         ...rest
      });
      const savedPost = await newPost.save();

      resp.status(200).json({savedPost});
   }
   catch(err) {
      next(err);
   }
});

// Delete post
postRouter.delete('/:id', userExtractor, async(req, resp, next) => {
   try {
         const { id: postId } = req.params;

         const post = await Post.findById(postId);

         if(req.userId !== post.userFeed.toString()) {
            return resp.status(401).json({ Message: 'Insufficient permisions '});
         }

         await Post.findByIdAndDelete(postId);
         resp.status(204).send('Post deleted');
      }
   catch(err) {
      next(err);
   }

});


// Add comment
postRouter.put('/comment/:id', async (req, resp, next) => {
   try {
      const { id: postId } = req.params;
      const { comment } = req.body;

      const post = await Post.findById(postId);
      
      post.comments = post.comments.concat({ comment });
      const updatedPost = await post.save();

      resp.status(200).json({ 
         Message: 'Comment posted',
         updatedPost
      });

   } catch(err) {
      next(err);
   }

});



// Delete comment
postRouter.delete('/:postId/comment/:commentId',userExtractor , async(req, resp, next) => {
   try {
      const { postId, commentId } = req.params;

      const post = await Post.findById(postId);


      if(req.userId !== post.userFeed.toString()) {
         return resp.status(401).json({ Message: 'Insufficient permisions '});
      }

      const updatedPost = await Post.findByIdAndUpdate(postId, {
         $pull: {
            comments: {
               _id: commentId
            }
         }
      }, { new: true});

      resp.status(204).json({ Message: 'Ok', updatedPost });
   }
   catch(err) {
      next(err);
   }
});

postRouter.use(handleErrors);

module.exports = postRouter;
