const mongoose = require('mongoose');

// needs to refer to Pokemon, so it needs the ObjectId type
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    favoritePokemon: {
        type: [{
            type: ObjectId,
            ref: "Pokemon"
        }]
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;