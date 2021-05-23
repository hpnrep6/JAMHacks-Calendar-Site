const mongoose = require('mongoose');

const User = mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    }, name: {
        type: String,
        required: true
    }, password: {
        type: String,
        required: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Users', User, 'Users');

