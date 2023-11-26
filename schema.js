const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(), 
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
        image: Joi.string().allow("", null),
        catagory: Joi.string().valid("Trending", "Pool", "Rooms", "Tropical", "Beachfront", "Cave", "Hotel", "historical", "Tower", "Houseboat", "food", "location", "none").allow("",null),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});