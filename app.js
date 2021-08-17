//////////// dependencies //////////////
var express     = require("express"),
    multer      = require("multer"),
    bodyParser  = require("body-parser"),
    app         = express();
    path 		= require('path');
    session     = require('express-session');
	

const url 		= require('url');    
////////////////////////////////////////
    
//////////// mysql connection //////////
const mysql = require('mysql');
    
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'penguen123',
    database: 'uni_media'
});
    
db.connect(function (err) {
    if (err) throw err;
        console.log('MySQL is connnected.');
});
////////////////////////////////////////

//////// dependencies attributes ///////
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
////////////////////////////////////////

////////////// routes //////////////////
const controller = require('./controller');
//let router = express.Router();

app.get("/", controller.index);

app.get("/home", controller.home);

app.get("/about", controller.about);

app.get("/contact", controller.contact);

app.get("/login", controller.login);

app.get("/register", controller.register);

app.post('/check_login', controller.check_login);

app.post("/check_register", controller.check_register);

app.get('/welcome', controller.welcome);

app.get('/profile', controller.profile);

app.get('/logout', controller.logout);

app.get("*", controller.star);
////////////////////////////////////////

///////////// setting port /////////////
app.listen(3000, function(){
    console.log("Listening port number : 3000")
});
////////////////////////////////////////

module.exports.db = db;
module.exports = app;