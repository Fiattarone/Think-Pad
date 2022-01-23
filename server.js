require('dotenv').config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const _ = require("lodash");
const dateAndTime = require(__dirname + "/dateFunc/date.js");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const TwitterStrategy = require("passport-twitter-oauth2").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const ejs = require("ejs");

const PORT = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(cors({
  origin: "/",
  credentials: true
}))
app.use(session({
  secret: "Oh, the secret has been noted.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/note");
  } else {
    res.redirect("/welcome");
  }
});
app.use(express.static(path.join(__dirname, "client", "build")));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb+srv://dtfthinks:Thinks123@clustathis.tuj0r.mongodb.net/userDB");

const noteSchema = new mongoose.Schema({
  title: String, 
  content: String, 
  date: String, 
  priority: {
    type: Number,
    min: [0, "Minimum Priority Understepped."],
    max: [10, "Maximum Priority Overstepped."]
  },
  progress:  {
    type: Number,
    min: [0, "Minimum Priority Understepped."],
    max: [100, "Maximum Priority Overstepped."]
  }
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  facebookId: String,
  linkedInId: String, 
  twitterId: String, 
  githubId: String,
  noteList: [noteSchema]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const Notebook = mongoose.model("Notebook", noteSchema);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // console.log("What is the id: " + id + " and the type is: " + typeof(id))
  if( !mongoose.Types.ObjectId.isValid(id) ) {
    id = mongoose.Types.ObjectId(id+"00");
  }
  User.findById(id, function(err, user) {
    done(err, user);
  });
  
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://aqueous-springs-25026.herokuapp.com/auth/google/think-it"
  // userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id}, function(err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: "https://aqueous-springs-25026.herokuapp.com/auth/facebook/think-it"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOrCreate({ facebookId: profile.id}, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

// Requires a consumer key option
passport.use(new TwitterStrategy({
  consumerKey: process.env.T_ID,
  consumerSecret: process.env.T_SECRET,
  callbackURL: "https://aqueous-springs-25026.herokuapp.com/auth/twitter/think-it"
},
function(token, tokenSecret, profile, done) {
  console.log(profile);
  User.findOrCreate({ twitterId: profile.id}, function(err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
}
));

passport.use(new LinkedInStrategy({
  clientID: process.env.LI_ID,
  clientSecret: process.env.LI_SECRET,
  callbackURL: "https://aqueous-springs-25026.herokuapp.com/auth/linkedin/think-it",
  scope: ['r_emailaddress', 'r_liteprofile'],
  state: true
}, function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    User.findOrCreate({ linkedInId: profile.id}, function(err, user) {
          if (err) { return done(err); }
          done(null, user);
        });
  });
}));

passport.use(new GithubStrategy({
  clientID: process.env.GH_ID,
  clientSecret: process.env.GH_SECRET,
  callbackURL: "https://aqueous-springs-25026.herokuapp.com/auth/github/think-it"
},
function(accessToken, refreshToken, profile, done) {
  console.log(profile);
  User.findOrCreate({ githubId: profile.id}, function(err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
}
));

app.get("/api", (req, res) => {
  console.log("This happens."); 
  res.json({ message: "Hello from server!" });
  
});

app.get("/note", async (req, res) => {

  if (req.isAuthenticated()) {
    console.log("This was the username: " + req.user.username + " and the ID: " + req.user.id);
    User.findById(req.user.id, (err, userFound) => {
      console.log("This was the user found: " + userFound);
      if (!err) {
        console.log("These are all this users notes." + userFound.noteList);
        res.json(userFound.noteList);
      } else {
        console.log("error: " + err);
      }
    });
  }
})

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get("/auth/google/think-it",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/home");
  }
);

app.get("/auth/facebook",
passport.authenticate("facebook")
);

app.get("/auth/facebook/think-it",
  passport.authenticate("facebook",
  { successRedirect: "/home",
    failureRedirect: "/login" })
);

app.get("/auth/linkedin", 
passport.authenticate("linkedin")
);

app.get("/auth/linkedin/think-it",
  passport.authenticate("linkedin",
  { successRedirect: "/home",
    failureRedirect: "/login" })
);

app.get("/auth/twitter",
passport.authenticate("twitter")
);

app.get("/auth/twitter/think-it",
  passport.authenticate("twitter",
  { successRedirect: "/home",
    failureRedirect: "/login" })
);

app.get("/auth/github", 
passport.authenticate("github")
);

app.get("/auth/github/think-it",
  passport.authenticate("github",
  { successRedirect: "/home",
    failureRedirect: "/login" })
);

app.get("/privacy-policy", (req, res) => {
  res.render("privacy")
})

app.post("/", async (req, res) => {
  const newNote = new Notebook({
    title: _.startCase(req.body.title),
    content: req.body.content, 
    date: dateAndTime.getDateAndTime(), 
    priority: req.body.priority, 
    progress: req.body.progress
  });

  try {
    if (!newNote) {
      throw Error("Could not save note.");
      }
   if (req.isAuthenticated) {
    console.log("Reading user and user ID: " + req.user.username + " " + req.user.id);
    User.findById(req.user.id, (err, foundUser) => {
      if (!err) {
        foundUser.noteList.push(newNote);
        foundUser.save(() => {
          console.log("Successfully saved!");
        })
      } else {
        console.log("There was an error: " + err);
      }
    });
    res.status(200).json(newNote);
    } else {
      res.redirect("/welcome");
    }
   } catch (err) {
      console.log("There was an error: " + err);
      res.sendStatus(400).json(newNote);
    }
   }); 

app.put("/update/:noteTitle", async (req, res) => {
  await User.findById(req.user.id, (err, foundUser) => {
    if (!err) {
      foundUser.noteList.forEach(noteInList => {
        if (noteInList.title === _.startCase(req.params.noteTitle)) {
          noteInList.title = _.startCase(req.body.title); 
          noteInList.content = req.body.content;
          noteInList.priority = req.body.priority;
          noteInList.progress= req.body.progress;
          console.log("Update complete for (old): " + req.params.noteTitle + " and for (new): " + req.body.title + " " + req.body.content + " " +  req.body.priority + " " + req.body.progress);
          foundUser.save(() => {
            console.log("Founduser Saved!");
          });
        }
      });
      } else {
      console.log("Error found: " + err);
    }
  }).clone().catch(function(err){ console.log(err)});
})

app.delete("/delete/:specificNote", async (req, res) => {
  try {
    await User.updateOne({username: req.user.username}, {$pull: { noteList: {title: req.params.specificNote}}}, err => {
      if (!err) {
        console.log("Element was pulled. New list after updateONe: " + req.user.noteList);
      } else {
        console.log("Error in deletion: " + err);
      }
      })
  } catch (err) {
    res.status(400).json({msg: err.message, success: false})
  }
 
});

app.get("/welcome", (req, res) => {
  console.log("A welcome has happened");
  res.render("welcome");
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  let passwordDidMatch = true;
  res.render("register", {passwordMatch: passwordDidMatch});
});

app.post("/register", function(req, res) {
  let passwordDidMatch = true;
  if (req.body.password === req.body.passwordVerification) {
    User.register({ username: req.body.username}, req.body.password, function(err, user) {
      if (!err) {
        passport.authenticate("local")(req, res, function(){
          res.redirect("*");
        });
      } else {
        console.log("There was an error: " + err);
        res.redirect("/register");
      }
    });
  } else {
    //send false back to register
    passwordDidMatch = false;
    res.render("register", {passwordMatch: passwordDidMatch});
  }
  });

  app.post("/login", function(req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
  
    req.login(user, function(err){
      if (!err) {
        passport.authenticate("local")(req, res, function(){
          res.redirect("*");
        });
      } else {
        console.log("There was an error: " + err);
      }
    });
  });

  app.use((req, res, next) => {
    console.log("Sending React App");
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });

app.get("*", (req, res) => {
    console.log("Auth Status: " + req.isAuthenticated());
    res.redirect("/");
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});