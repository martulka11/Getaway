const express = require('express');
const router = express.Router();
const houses = require('../controllers/houses')
const catchAsync = require('../utils/catchAsync');
const {storage} = require('../cloudinary')
const { isLoggedIn, isAuthor, validateHouse } = require('../utils/middleware');
const multer = require('multer');
const upload = multer({storage});


router.route('/')
    .get(catchAsync(houses.listOfHouses))
    .post(isLoggedIn, upload.array('image'), validateHouse, catchAsync(houses.createHouse));

router.get('/new', isLoggedIn, houses.renderNewForm);

router.route('/:id')
    .get(catchAsync(houses.showHouse))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateHouse, catchAsync(houses.updateHouse))
    .delete(isLoggedIn, isAuthor, catchAsync(houses.deleteHouse));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(houses.renderEditForm));


module.exports = router;