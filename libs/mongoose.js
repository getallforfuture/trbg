const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://dddfffggg:1a2s3d4f@cluster0-79fwg.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = mongoose;