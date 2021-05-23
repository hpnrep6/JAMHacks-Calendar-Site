const mongoose = require('mongoose');

const Event = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    }, name: {
        type: String,
        required: true
    }, description: {
        type: String
    }, start: {
        type: Number,
        required: true
    }, end: {
        type: Number,
        required: true
    }, day: {
        type: Number,
        required: true
    } 
}, {
    versionKey: false
});

const Timetable = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    }, user: {
        type: String,
        required: true
    }, name: {
        type: String,
        required: true
    }, description: {
        type: String
    }, events: {
        type: [Event],
        default: []
    }
})

module.exports.event = mongoose.model('Events', Event)

module.exports.timetable = mongoose.model('Timetables', Timetable, 'Timetables');