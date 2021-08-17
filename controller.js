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
			res.render("home_page", {id : req.session.username});
		} else {
			res.redirect('/login');
		}
		res.end();
	},

	about : function(req, res){
		if (req.session.loggedin) {
			res.render("about_page", {id : req.session.username});
		} else {
			res.redirect('/login');
		}
		res.end();
	},

	contact : function(req, res){
		if (req.session.loggedin) {
			res.render("contact_page", {id : req.session.username});
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
				req.session.username = returns[0];
				console.log("succesful login");
				res.redirect('/home');
				
			} else {
				console.log("incorrect username or password");
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
				console.log("1 record inserted");
				res.redirect('/welcome');
			} else {
				console.log("record not inserted");
				res.redirect('/register');
			}			
			res.end();
	},

	welcome : function(req, res){
		res.render("welcome_page", {id : req.session.username});
	},

	profile : function(req, res){
		res.render("profile_page", {id : req.session.username});
	},

	logout : function(req, res){
		res.render("contact_page");
	},

	star : function(req, res){
		res.redirect('/home');
	}
}

module.exports = controller;