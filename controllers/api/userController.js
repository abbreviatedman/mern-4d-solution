const bcrypt = require('bcrypt');

const User = require('../../models/userModel');
const { sendGenericError } = require('../../utilities/utilities');

const createUser = async (req, res) => {
    try {
        // create a salt and encrypt the password from the request body
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(req.body.password, salt)
        // create a user object
        const user = {
            username: req.body.username,
            password: encryptedPassword,
            favoritePokemon: [],
        }

        // insert that object into the database as a document
        const userDocument = await User.create(user);
        res.redirect('/logIn')
    } catch (error) {
        const packet = {
            message: 'create user failure',
            payload: error,
        }

        console.log(packet);
        res.status(500).json(packet);
    }
}

const logInUser = async (req, res) => {
    try {
        // find the user that matches the request body
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            throw "No user by that name, please sign up.";
        }

        const isCorrectPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isCorrectPassword) {
            throw "Please check your password and try again.";
        }

        req.session.isAuth = true;
        const userData = {
            username: user.username,
            id: user._id,
        }

        req.session.user = userData;
        res.redirect('/user')
    } catch (error) {
        const packet = {
            message: 'failure logging in',
            payload: error,
        }

        console.log(packet);
        res.status(500).json(packet);
    }
}

const addFavoritePokemon = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        user.favoritePokemon.push(req.query.pokeId);
        await user.save();
        res.redirect('/user')
    } catch (error) {
        sendGenericError(res, 'failure in adding favorite pokemon', error);
    }
}

module.exports = {
    createUser,
    logInUser,
    addFavoritePokemon,
}