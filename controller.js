const model = require('./model');

const controller = {

	index : function(req, res){
		if (req.session.loggedin) {
			res.redirect('/home');
		} else {
			res.redirect('/login');
		}
		res.end();
	},

	home : function(req, res){
		if (req.session.loggedin) {
			res.render("home_page",{
				name : req.session.name,
			});
		} else {
			res.redirect('/login');
		}
		res.end();
	},

	forum : async function(req, res){
		if (req.session.loggedin) {
			var all_post = await model.post(req, res);
			var all_comment = await model.comment(req, res);
			var category_1 = await model.count_post(req, res, "Ders Notları");
			var category_2 = await model.count_post(req, res, "Yurtlar");
			var category_3 = await model.count_post(req, res, "Genel");
			res.render("forum_page", {
				all_post : all_post,
				all_comment : all_comment,
				name : req.session.name,
				category_1 : category_1,
				category_2 : category_2,
				category_3 : category_3
			});
		} else {
			res.redirect('/login');
		}
		res.end();
	},

	category : async function(req, res){
		if (req.session.loggedin) {
			var all_post = await model.post_category(req, res, req.query);
			var all_comment = await model.comment(req, res);
			res.render("forum_page", {
				all_post : all_post,
				all_comment : all_comment,
				name : req.session.name
			});
		} else {
			res.redirect('/login');
		}
		res.end();
	},

	search : async function(req, res){
		if (req.session.loggedin) {
			var all_post = await model.post_search(req, res, req.query);
			var all_comment = await model.comment(req, res);
			res.render("forum_page", {
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
				res.redirect('/index');
				
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
				res.redirect('/forum');
			} else {
				console.log("post not inserted.");
				res.redirect('/forum');
			}			
			res.end();
	},

	like_post : async function(req, res){ 
		like_post_check = await model.like_post_check(req, res);
		if(like_post_check.length < 1){

			like_post = await model.like_post(req, res);
		}
		res.redirect('/forum');			
		res.end();
	},
	
	write_comment : async function(req, res){
		new_comment = await model.write_comment(req, res);
			if (new_comment.user_id > 0) {
				console.log("comment inserted.");
				res.redirect('/forum');
			} else {
				console.log("comment not inserted.");
				res.redirect('/forum');
			}			
			res.end();
	},

	welcome : function(req, res){
		res.render("welcome_page", {name : ""});
	},

	profile : async function(req, res){

		if (req.session.loggedin) {
			var profile = await model.show_profile(req, res);
			var all_post = await model.post_profile(req, res);
			res.render("profile_page", {
				all_post : all_post,
				profile : profile,
				name : req.session.name
			});
		} else {
			res.redirect('/login');
		}
		res.end();
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