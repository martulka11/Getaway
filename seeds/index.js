const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const House = require('../models/house');

mongoose.connect('mongodb://localhost:27017/house', {
    useNewUrlParser: true,
    //node useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await House.deleteMany({});
    for (let i = 0; i < 150; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) +10;
        const house = new House({
            author: '61791652ccf7773edc7eff0e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: { url: 'public\images\tom-king-f-JRHKG4S3k-unsplash.jpg'},
            /*  {
                url: 'https://res.cloudinary.com/martaaa19190/image/upload/v1624656792/YelpCamp/ifycmxj3puenlrndtcog.jpg',
                filename: 'YelpCamp/ifycmxj3puenlrndtcog'
              },
              {
                url: 'https://res.cloudinary.com/martaaa19190/image/upload/v1624656792/YelpCamp/fefamlwr5a9tnuucqxum.jpg',
                filename: 'YelpCamp/fefamlwr5a9tnuucqxum'
              }
            ],*/
            description: 'Kemping ang. camping "obozowisko" – obiekt turystyczny położony na większym terenie, ogrodzony i strzeżony, na którym goście zatrzymują się na pobyt w namiotach, samochodach kempingowych i przyczepach kempingowych, ale mogą także korzystać z pawilonów, domków turystycznych lub innych obiektów stałych.',
            price: `${price}`,
            place: 'wood',
            numberOfPeople: 4,
            attractions: 'Pool outside and inside, bar',
            geometry: {
                type: "Point",
                coordinates: [
                   cities[random1000].longitude,
                   cities[random1000].latitude,
                ]
            }
        })
        await house.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})


