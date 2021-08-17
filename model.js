const app = require('./app');

const model = {

    async check_login(req,res) {
        if (req.body.username && req.body.password) {
		    const returns = await app.db.query('SELECT * FROM accounts WHERE username = ? AND password = ?', 
            [req.body.username, req.body.password]);
            return returns.values;
		} else {
			console.log("enter username and password");
		}
    },

    async check_register (req,res) {	
        const returns = await app.db.query( "INSERT INTO accounts (username, password, email) VALUES (?,?,?)", 
        [req.body.username, req.body.password, req.body.email]);
        return returns.values;
    }
}

module.exports = model;

    //db.query( "INSERT INTO accounts (username, password, email) VALUES (?,?,?)", [username, password, email],
    //      function(error, results, fields) {       
    //});