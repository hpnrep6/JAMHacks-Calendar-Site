const mongoose = require('mongoose');

// id is name of counter
const CounterSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
    }, counter: {
        type: Number,
        default: 1
    }    
});

module.exports = mongoose.model('Counter', CounterSchema, 'Counters');

