const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// environment variables!
require("dotenv/config");

// Encryption library
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

// Very importannt to parse all json objects parsed!
app.use(express.json());

// Very important to user cors to enable cross platfrom info transfer
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Important to put these!!
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// For session
app.use(
  session({
    key: "userid",
    secret: process.env.SECRET_HASH,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24, // 24h expiry for cookie
    },
  })
);

const db = mysql.createConnection({
  user: process.env.SERVER_USER,
  host: process.env.SERVER_HOST,
  password: process.env.SERVER_PASSWORD,
  database: process.env.SERVER_DATABASE,
});

// Register POST Request
app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const type = req.body.type;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(
      "SELECT * from users where username = ?",
      [username],
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }

        // If user doesn not exists
        if (result.length <= 0) {
          db.query(
            "INSERT INTO users (username, password, type) VALUES (?,?,?)",
            [username, hash, type],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                console.log("User inserted");
                res.send({ message: "Success!" });
              }
            }
          );
        } else {
          console.log("User already exists");
          res.send({ messageExists: "User already exists" });
        }
      }
    );
  });
});

// GET to check if user is already login in via session
app.get("/login", (req, res) => {
  // If session.user exists
  if (req.session.user) {
    // Send object with loggedIn = true
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

// verifyJWT is a middleware to check if the user has a valid token
const verifyJWT = (req, res, next) => {
  // grabbing the token
  const token = req.headers["x-access-token"];

  if (!token) {
    res.send("We need a token");
  } else {
    jwt.verify(token, "jwtSecret", (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "You failed to authenticate" });
      } else {
        // Save the decoded id into the variable userId
        req.userId = decoded.id;
        next();
      }
    });
  }
};
// GET to check if user is authenticated
app.get("/isUserAuth", verifyJWT, (req, res) => {
  res.send("You are authenticated, congratz");
});

// Check if user exists
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * from users where username = ?",
    [username],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      // If user exists
      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            // Grab the user's id on the db
            const id = result[0].id;

            // Create jwt, use .env files for the jwt secret to not publish stuff with secret info!
            const token = jwt.sign({ id }, "jwtSecret", {
              expiresIn: 300,
            });

            // Create a session and place the result into it
            req.session.user = result;

            res.json({ auth: true, token: token, result: result });

            console.log(`${username} logged in!`);
          } else {
            res.json({ auth: false, message: "Wrong username/password" });
          }
        });
      } else {
        res.json({ auth: false, message: "User does not exist" });
      }
    }
  );
});

app.listen(3001, () => {
  console.log("Server is running on 3001 yay!");
});
