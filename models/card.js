const mongoose = require('mongoose');

const { user } = require('./user');

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    link: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
        required: true,
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        default:[]
    },
    createdAt: {
        type: mongoose.Schema.Types.ObjectId,
        default:Date.now
    },    
});

const Card = mongoose.model('card', cardSchema);

module.exports = { Card };