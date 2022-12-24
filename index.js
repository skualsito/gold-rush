const CLIENT_ID = 654019946070939;
const CLIENT_SECRET = "5ca17b8a4bca9443fae595c8e5fca2e2";
const port = 3000;

const express = require('express');
const passport = require('passport');
const InstagramStrategy = require('passport-instagram').Strategy;
const axios = require('axios');
const app = express();

passport.use(new InstagramStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: "https://goldrush-lacosta.netlify.app:3000/auth/instagram/callback"
},
function(accessToken, refreshToken, profile, cb) {
  // Aquí puedes guardar el perfil del usuario en tu base de datos
  return cb(null, profile);
}
));

app.get('/auth/instagram', passport.authenticate('instagram'));

app.get('/auth/instagram/callback', 
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(req, res) {
    // Si la autenticación tiene éxito, obtén los datos del usuario
    axios.get('https://api.instagram.com/v1/users/self', {
      headers: {
        'Authorization': `Bearer ${req.user.accessToken}`
      }
    })
    .then(response => {
      const userData = response.data.data;
      // Aquí puedes hacer algo con los datos del usuario, como mostrarlos en la página
      res.send(userData);
    })
    .catch(error => {
      console.error(error);
      res.send('Error al obtener los datos del usuario');
    });
  }
);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Funcionando en el puerto ${port}`)
})