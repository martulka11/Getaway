const House = require('../models/house');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken})
const { cloudinary } = require("../cloudinary");

/*
function getSortingObject(){
    const value = document.getElementById("sorting").value
    if(document.getElementById("sorting").value === "1"){
        return {title:1}
    } else if(document.getElementById('sorting').value == "2"){
        return {title:-1}
    }else if(document.getElementById('sorting').value == "3"){
        return {price:1}
    }else if(document.getElementById('sorting').value == "4"){
        return {price:-1}
    } else {
        return {title:-1}
    }
}
*/

module.exports.listOfHouses = async (req, res) => {
    const houses = await House.find({});
    res.render('houses/houses', {houses} );
};

module.exports.renderNewForm = (req, res) => {
    res.render('houses/new');
};

module.exports.createHouse = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.house.location,
        limit: 1
    }).send()
    const house = new House(req.body.house);
    house.geometry = geoData.body.features[0].geometry;
    house.images = req.files.map(p => ({url: p.path, filename: p.filename}))
    house.author = req.user._id
    await house.save();   
    req.flash('success', 'Successfully made a new house')
    res.redirect(`/houses/${house._id}`)
};

module.exports.showHouse = async (req, res) => {
    const house = await House.findById(req.params.id).populate({ 
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!house) {
        req.flash('error', 'Cannot find the house!');
        return res.redirect('/houses');
    }
    res.render('houses/show', {house});
}


module.exports.renderEditForm = async (req, res) => {
    const house = await House.findById(req.params.id)
    if(!house) {
        req.flash('error', 'Cannot find the house!');
        return res.redirect('/houses');
    }
    res.render('houses/edit', { house })
};

module.exports.updateHouse = async (req, res) => {
    const { id } = req.params;
    const house = await House.findByIdAndUpdate(id, {...req.body.house});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    house.images.push(...imgs);
    await house.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated house')
    res.redirect(`/houses/${house._id}`)
};

module.exports.deleteHouse = async (req, res) => {
    const { id } = req.params;
    await House.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted house!')
    res.redirect('/houses');
};