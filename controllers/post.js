


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
      

      const user = await User.findById(userId);
      if(!user) {
         return resp.send(400).json({ Message: 'User not found'});
      }

      const newPost = new Post({
         ...rest
      });
      const savedPost = await newPost.save();


      user.posts = user.posts.concat(savedPost._id);
      await user.save();

      resp.status(200).json({savedPost});
   }
   catch(err) {
      next(err);
   }

});

// IMPLEMENTAR EL JWT
// Delete post
postRouter.delete('/:id', userExtractor, async(req, resp, next) => {
   try {
      const { id } = req.params;
      const updatedUser = await User.findByIdAndUpdate(req.userId, {
         $pull: {
            posts: id
         }
      }, { new: true})
         .populate({
            path: 'posts', 
            options: { 
               sort: { 
                  'createdAt': -1 
               } 
            } 
         });
         await Post.findByIdAndDelete(id);
         resp.status(200).json({ updatedUser });
      }
   catch(err) {
      next(err);
   }

});



// Add comment
postRouter.put('/comment/:id', async (req, resp, next) => {
   try {
      const { id } = req.params;
      const { comment } = req.body;


      const post = await Post.findById(id);
      
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



// IMPLEMENTAR EL JWT
// Delete comment
postRouter.delete('/:postId/comment/:commentId', async(req, resp, next) => {
   try {
      const { postId, commentId } = req.params;

      await Post.findByIdAndUpdate(postId, {
         $pull: {
            comments: {
               _id: commentId
            }
         }
      }, { new: true});

      resp.status(204).json({ Message: 'Ok'});
   }
   catch(err) {
      next(err);
   }


});

postRouter.use(handleErrors);

module.exports = postRouter;
