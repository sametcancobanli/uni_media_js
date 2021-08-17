const model = require('./model');

const controller = {
	index : function(req, res){
		if (req.session.loggedin) {
			res.redirect('/home');
		} else {
			res.redirect('/login_page');
		}
		res.end();
	},

	home : function(req, res){
		if (req.session.loggedin) {
			res.render("home_page", {id : req.session.user});
		} else {
			res.redirect('/login');
		}
		res.end();
	},

	about : function(req, res){
		if (req.session.loggedin) {
			res.render("about_page", {id : req.session.user});
		} else {
			res.redirect('/login');
		}
		res.end();
	},

	contact : function(req, res){
		if (req.session.loggedin) {
			res.render("contact_page", {id : req.session.user});
		} else {
			res.redirect('/login');
		}
		res.end();
	},

	login : function(req, res){
		res.render("login_page");
	},

	check_login : async function(req, res) {
		var returns = await model.check_login(req, res);
			if (returns.length > 0) {
				req.session.loggedin = true;
				req.session.user = returns[0];
				console.log("Succesful login.");
				res.redirect('/home');
				
			} else {
				console.log("Incorrect username or password.");
				res.redirect('/login');
			}			
			res.end();
	},

	register : function(req, res){
		res.render("register_page");
	},

	check_register : async function(req, res){
		var returns = await model.check_register(req, res);
			if (returns.length > 0) {
				console.log("Record inserted.");
				res.redirect('/welcome');
			} else {
				console.log("Record not inserted.");
				res.redirect('/register');
			}			
			res.end();
	},

	welcome : function(req, res){
		res.render("welcome_page", {id : req.session.user});
	},

	profile : function(req, res){
		res.render("profile_page", {id : req.session.user});
	},

	logout : function(req, res){
		req.session.loggedin = false;
		console.log("Succesful logout.");
		res.redirect('/login_page');
	},

	star : function(req, res){
		res.redirect('/home');
	}
}

module.exports = controller;