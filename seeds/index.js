//in this we are loading our data into database by using node seeds/index.js

const mongoose = require('mongoose');
const Campground =require('../models/campground')// importing product.js
const {places,descriptors}= require('./seedHelper')
const indian_cities=require('./in.json')



async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log("connected sucessfully")
}
main().catch(err => console.log(err));


const sample=(arr)=>{ return arr[Math.floor(Math.random()*arr.length)]}

const seedDB=async()=>{
    await Campground.deleteMany({});
    
    for(let cities of indian_cities){
        const price=Math.floor(Math.random()*5000)+500;
        const camp=new Campground({
            author:'66e191ca5838e290fe05110a',
            location:`${cities.city},${cities.admin_name}`,
            title :`${sample(descriptors)} ${sample(places)}`,
            description:"Nestled in serene, lush forests, this campground offers a tranquil escape. Enjoy convenient camping sites, clean restrooms, and activities like swimming and fishing in the lake. It's the perfect spot for a peaceful family getaway.",
            price:price,
            images: [
                {
                    url: 'https://res.cloudinary.com/du7fsy8uw/image/upload/v1727099115/YELDCAMP/d42dak8b5qdwsnwe6ite.jpg',
                    filename: 'YELDCAMP/d42dak8b5qdwsnwe6ite'
                   
                },
                {
                    url: 'https://res.cloudinary.com/du7fsy8uw/image/upload/v1727099112/YELDCAMP/lauvebmza3ldvpoynfzw.jpg',
                    filename: 'YELDCAMP/lauvebmza3ldvpoynfzw'
                    
                } ]
        })
        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})
 
