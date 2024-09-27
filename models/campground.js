const mongoose = require('mongoose');
const Review=require('./review');
const Schema=mongoose.Schema;

const imageSchema = new Schema({
  url:String,
  filename:String
})
imageSchema.virtual('thumbnail').get(function(){                 //making virtual propertie in image schema that we can you further 
  return this.url.replace('/upload','/upload/w_200')
})

const campgroundschema=new Schema({
    title: String,
    images:[imageSchema],
    price: Number,
    description: String,
    location: String,
    author:{
      type: Schema.Types.ObjectId,
      ref:'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
})

//middleware the run after a campground is deleted using findoneanddelete method (query middleware)
campgroundschema.post('findOneAndDelete', async function(doc) {  //doc refer to the object that is deleted
    if (doc) {
      await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
  });
  

module.exports =mongoose.model('Campground',campgroundschema);
