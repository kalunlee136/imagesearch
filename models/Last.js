var mongoose = require('mongoose');

var LastUrlSchema = new mongoose.Schema({
    last_url: String
});

module.exports = mongoose.model('LastUrl',LastUrlSchema);
