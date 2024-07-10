// Gives access to the collection in our database
const Pokemon = require("../../models/pokemonModel");
const User = require("../../models/userModel");
const {sendGenericError} = require('../../utilities/utilities');
/*
    11. A) Import the User collection
*/

// Return a web page to the client with the entire collection
async function renderAllPokemon(req, res) {
  try {
    let result = await Pokemon.find({});

    // Populates a web page with our entire collection data
    res.render("allMons", { pokemon: result });
  } catch (error) {
    console.log(`renderAllPokemon error: ${error}`);
  }
}

// Return a web page to the client with ONE document in the collection
async function renderOnePokemon(req, res) {
  try {
    const pokemon = await Pokemon.findOne({ Name: req.params.name });
    // search for the current user in the database
    const user = await User.findById(req.session.user.id)
    // check if the current pokemon's id is in the user's favoritePokemon array
    const isFaved = user.favoritePokemon.includes(pokemon._id);
    res.render("oneMon", { pokemon: pokemon, isFaved: isFaved });
  } catch (error) {
    console.log(`renderOnePokemon error: ${error}`);
  }
}

// Return a web page where clients can post a new document in the collection
async function renderCreatePokemonForm(req, res) {
  try {
    res.render("createMon");
  } catch (error) {
    console.log(`renderCreatePokemonForm error: ${error}`);
  }
}

// Return a web page where clients can update a document in the collection
async function renderUpdatePokemonForm(req, res) {
  try {
    // Target the correct document to be updated
    let result = await Pokemon.find({ Name: req.params.name });

    // Render the update form with the filled-in original info
    res.render("updateMon", { pokemon: result[0] });
  } catch (error) {
    console.log(`renderUpdatePokemonForm error: ${error}`);
  }
}

/*
    6. Set up Sign up and Log in functions
*/
const renderSignUp = (_, res) => {
  try {
    res.render('signUp');
  } catch (error) {
    console.log('render sign up error');
    console.log(error);
  }
}

const renderLogIn = (_, res) => {
  try {
    res.render('logIn');
  } catch (error) {
    console.log('render log in error');
    console.log(error);
  }
}
/*
    11. B) Set up front-end function to render user page
*/
const renderUserPage = async (req, res) => {
  try {
    if (!req.session.isAuth) {
      res.redirect('/logIn');

      return;
    }

    const user = await User.findOne({username: req.session.user.username})
    const pokeIds = user.favoritePokemon;
    // Find all Pokemon whose id is in the pokeIds array.
    // The .select is how you use "projection", a technique for having the
    // database only send some fields from each document. This saves you time
    // and money in network transfer.
    const pokemons = await Pokemon
      .find({_id: {$in: pokeIds}})
      .select({Name: true, _id: false})

    const pokeNames = pokemons.map((pokemon) => pokemon.Name)

    res.render('user', { username: user.username, pokeNames })
  } catch (error) {
    const packet = {
      message: 'failure in rendering user page',
      payload: error
    };
    
    console.log(packet);
    res.status(500).json(packet);
  }
}
/*
    16. Set up front-end function to log the user out
*/

const logOutUser = (req, res) => {
  try {
    res.clearCookie('connect.sid', {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: null,
    })

    req.session.destroy();

    res.redirect('/login');
  } catch (error) {
    sendGenericError(res, 'failure in logout', error)
  }
}

module.exports = {
  renderAllPokemon,
  renderOnePokemon,
  renderCreatePokemonForm,
  renderUpdatePokemonForm,
  renderSignUp,
  renderLogIn,
  renderUserPage,
  logOutUser,
};
