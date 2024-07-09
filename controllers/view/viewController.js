// Gives access to the collection in our database
const Pokemon = require("../../models/pokemonModel");
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
    // console.log(`req.params.name: ${req.params.name}`);

    // This returns array, even if it's just one result.
    let result = await Pokemon.find({ Name: req.params.name });

    // console.log(`result ${result}`);

    /*
            21. Modify renderOnePokemon() to show the page based on the login session
        */

    // Use oneMon.ejs file, all data will be in pokemon
    res.render("oneMon", { pokemon: result[0] });
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

    res.render('user', { username: req.session.user.username })
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
