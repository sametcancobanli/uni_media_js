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

	home : async function(req, res){
		if (req.session.loggedin) {
			var all_post = await model.post(req, res);
			var all_comment = await model.comment(req, res);
			res.render("home_page", {
				all_post : all_post,
				all_comment : all_comment,
				name : req.session.name
			});
		} else {
			res.redirect('/login');
		}
		res.end();
	},

	about : function(req, res){
		if (req.session.loggedin) {
			res.render("about_page", {name : req.session.name});
		} else {
			res.redirect('/login');
		}
		res.end();
	},

	contact : function(req, res){
		if (req.session.loggedin) {
			res.render("contact_page", {name : req.session.name});
		} else {
			res.redirect('/login');
		}
		res.end();
	},

	login : function(req, res){
		res.render("login_page");
	},

	check_login : async function(req, res) {
		var new_login = await model.check_login(req, res);
			if (new_login.user_id > 0) {
				req.session.loggedin = true;
				req.session.token = new_login.user_id;
				req.session.name = new_login.name;
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

		new_register = await model.check_register(req, res);
			if (new_register.user_id > 0) {
				console.log("Record inserted.");
				res.redirect('/welcome');
			} else {
				console.log("Record not inserted.");
				res.redirect('/register');
			}			
			res.end();
	},

	write_post : async function(req, res){
		new_post = await model.write_post(req, res);
			if (new_post.user_id > 0) {
				console.log("post inserted.");
				res.redirect('/home');
			} else {
				console.log("post not inserted.");
				res.redirect('/home');
			}			
			res.end();
	},

	write_comment : async function(req, res){
		new_comment = await model.write_comment(req, res);
			if (new_comment.user_id > 0) {
				console.log("comment inserted.");
				res.redirect('/home');
			} else {
				console.log("comment not inserted.");
				res.redirect('/home');
			}			
			res.end();
	},

	welcome : function(req, res){
		res.render("welcome_page", {name : ""});
	},

	profile : function(req, res){
		res.render("profile_page", {name : req.session.name});
	},

	logout : function(req, res){
		req.session.loggedin = false;
		req.session.name = "";
		console.log("Succesful logout.");
		res.redirect('/login_page');
	},

	star : function(req, res){
		res.redirect('/home');
	}
}

module.exports = controller;