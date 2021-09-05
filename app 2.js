//////////// dependencies //////////////
var express     = require("express"),
    multer      = require("multer"),
    bodyParser  = require("body-parser"),
    app         = express();
    path 		= require('path');
    session     = require('express-session');

const url 		= require('url');    
////////////////////////////////////////
    
// //////////// mysql connection //////////
// const mysql = require('mysql');
    
// var db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'penguen123',
//     database: 'uni_media'
// });
    
// db.connect(function (err) {
//     if (err) throw err;
//         console.log('MySQL is connnected.');
// });
// ////////////////////////////////////////

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

app.get("/forum", controller.forum);

app.get("/forum/category", controller.category);

app.get("/forum/search", controller.search);

app.get("/about", controller.about);

app.get("/login", controller.login);

app.get("/register", controller.register);

app.post('/check_login', controller.check_login);

app.post("/check_register", controller.check_register);

app.post('/write_post', controller.write_post);

app.post('/like_post', controller.like_post);

app.post('/write_comment', controller.write_comment);

app.get('/welcome', controller.welcome);

app.get('/profile/:user_id', controller.profile);

app.get('/profile/:user_id/edit', controller.profile_edit);

app.post('/profile/:user_id/updated', controller.update_profile);

app.get('/profile/:user_id/delete_post/:post_id', controller.delete_post);

app.get('/dormitory', controller.dormitory);

app.get('/scholarship', controller.scholarship);

app.get('/logout', controller.logout);

app.get("*", controller.star);
////////////////////////////////////////

///////////// setting port /////////////
app.listen(3000, function(){
    console.log("Listening port number : 3000")
});
////////////////////////////////////////

module.exports = app;