const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NumbersSchema = new Schema({
    numberindex: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("numbers", NumbersSchema);