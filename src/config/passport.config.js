import passport from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';
import userModel from "../dao/models/user.model.js";
import { createHash, validatePassword } from "../utils.js";
import { userService } from "../repository/index.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, rol, cart, avatar } = req.body;
        try {
          
          const user = await userService.getUser({ email: username });
          
          if (user) {
            console.log("Usuario existente");
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            rol,
            cart,
            avatar
          };
          if(newUser.rol == ""){
            newUser.rol = "user";
          }
          // const result = await userModel.create(newUser);
          const result = await userService.createUser(newUser);
        
          return done(null, result);
        } catch (error) {
          return done("Error al registrar el usuario: " + error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    // const user = await userModel.findById(id);
    const user = await userService.getUserById(id)
    done(null, user);
  });

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userService.getUser({ email: username });

          if (!user) {
            console.log("No existe el usuario");
            return done(null, false);
          }
          if (!validatePassword(password, user)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done("Error al intentar ingresar: " + error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.2168180f78cffeaf",
        clientSecret: "2d0227fa27cef25fe01f29880eb581755bcc2972",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
        scope: ["user:email"]
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const user = await userService.getUser({ email: username });

          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              email:email,
              age: 18,
              password: "",
              rol:"user",
              cart:[]
            };
            const result = await userModel.create(newUser);
            done(null, result);
          } else {
            //ya existe el usuario
            done(null, user);
          }
        } catch (error) {
          return done(null, error);
        }
      }
    )
  );
};

export default initializePassport;
