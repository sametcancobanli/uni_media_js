const app = require('./app');

const model = {

    async check_login(req,res) {
        if (req.body.mail && req.body.password) {
		    const returns = await app.db.query('SELECT * FROM user WHERE mail = ? AND password = ?', 
            [req.body.mail, req.body.password]);
            return returns.values;
		} else {
			console.log("enter username and password");
		}
    },

    async check_register (req,res) {	

        const returns = await app.db.query( "INSERT INTO profile (user_id, name, surname, department, class, about, num_post, num_comment, num_reply) VALUES (?,?,?,?,?,?,?,?,?)", 
        [req.body.user_id, req.body.name, req.body.surname, req.body.department, req.body.class, req.body.about, 0,0,0 ]);

        await app.db.query( "INSERT INTO user (user_id, mail, password, school) VALUES (?,?,?,?)", 
        [req.body.user_id, req.body.mail, req.body.password, "itü"]);

        return returns.values;
    }
}

module.exports = model;

    //db.query( "INSERT INTO accounts (username, password, email) VALUES (?,?,?)", [username, password, email],
    //      function(error, results, fields) {       
    //});