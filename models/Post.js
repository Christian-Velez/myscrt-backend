const { Schema, model } = require('mongoose');


const postSchema = new Schema({
   userFeed: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },

   mainComment: {
      type: String,
      required: true
   },

   comments: [{
      comment: String,
      created_at: {
         type: Date,
         default: Date.now  
      }
   }]
}, { timestamps: true });

postSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id;
      delete returnedObject.__v;
   },
});

const Post = model('Post', postSchema);
module.exports = Post;