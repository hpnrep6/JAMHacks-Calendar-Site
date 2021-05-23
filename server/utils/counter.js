const mongoose = require('mongoose')
const scheme = require('../models/counter')

async function countUp(name) {
    let found = await scheme.findByIdAndUpdate(name, {$inc: {counter:1}})
    return found.counter;
}
module.exports.countUp = countUp;