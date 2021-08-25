const app = require('./app');

//////////// sequelize connection //////////
// instantiate sequelize
const Sequelize = require('sequelize');
const { promiseImpl } = require('ejs');
const { Op } = require("sequelize");
const uuid = require('uuid');

// connect db
const db = new Sequelize("uni_media", "root", "penguen123", {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: 0,
    define: {
        timestamps: false,
        freezeTableName: true
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

// Test DB
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))
////////////////////////////////////////
const user = db.define('user', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    mail: {
        type: Sequelize.STRING(50)
    },
    password: {
        type: Sequelize.STRING(50)
    },
    name: {
        type: Sequelize.STRING(50)
    },
    surname: {
        type: Sequelize.STRING(50)
    },
    school: {
        type: Sequelize.STRING(50)
    },
    department: {
        type: Sequelize.STRING(50)
    },
    class: {
        type: Sequelize.STRING(20)
    },
    about: {
        type: Sequelize.STRING(200)
    }
});
user.sync().then(() => {
    console.log('user table created');
});

const post = db.define('post', {
    post_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
    },
    p_text: {
        type: Sequelize.STRING(140)
    },
    p_area: {
        type: Sequelize.STRING(50)
    },
    p_vote: {
        type: Sequelize.INTEGER
    },
    time: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
});
user.sync().then(() => {
    console.log('post table created');
});

const comment = db.define('comment', {
    comment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    post_id: {
        type: Sequelize.INTEGER,
    },
    user_id: {
        type: Sequelize.INTEGER,
    },
    c_text: {
        type: Sequelize.STRING(140)
    }
});
user.sync().then(() => {
    console.log('comment table created');
});

user.hasMany(post, {foreignKey: 'user_id'})
post.belongsTo(user, {foreignKey: 'user_id'})

user.hasMany(comment, {foreignKey: 'user_id'})
comment.belongsTo(user, {foreignKey: 'user_id'})

const model = {

    async check_login(req,res) {

        const new_login = await user.findAll({
            where: {
                [Op.and]: [
                    { mail: req.body.mail },
                    { password: req.body.password }
                ]
            },
            raw: true,
        });

        return new_login[0];
    },

    async check_register (req,res) {	

        const new_user = await user.create({ 
                user_id: req.body.user_id,
                mail: req.body.mail,
                password: req.body.password,
                name: req.body.name,
                surname: req.body.surname,
                school: 'itü',
                department: req.body.department,
                class: req.body.class,
                about: req.body.about,
        });

        console.log(new_user instanceof user);
        return new_user.dataValues;
    },

    async post (req,res) {	

        const all_post = await post.findAll({  
            raw: true,
            include: [user],
            order: [
                ['time', 'DESC'],
            ],
    });

        return all_post;
    },

    async post_category (req,res, param) {	

        const all_post = await post.findAll({  
                where: {
                    p_area: param.category
                },
                raw: true,
                include: [user],
                order: [
                    ['time', 'DESC'],
                ],
        });

        return all_post;
    },

    async post_search (req,res, param) {	

        const all_post = await post.findAll({
            limit: 10,
            where: {
                p_text: {
                    [Op.like]: '%' + param.search + '%'
                }
        }});

        return all_post;
    },

    async comment (req,res) {	

        const all_comment = await comment.findAll({
            raw: true,
            include: [user]
        });

        return all_comment;
    },

    async write_post (req,res) {	

        const new_post = await post.create({
            user_id: req.session.token,
            p_text: req.body.p_text,
            p_area: req.body.p_area,
            p_vote: 0,
            raw: true,
        });

        return new_post;
    },

    async write_comment (req,res) {	

        const new_comment = await comment.create({
            user_id: req.session.token,
            c_text: req.body.c_text,
            post_id: req.body.post_id,
            raw: true,
        });

        return new_comment;
    },

    async show_profile (req,res) {	

        const profile = await user.findAll({  
                where: {
                    user_id: req.session.token,
                },
                raw: true,
        });

        return profile[0];
    },

    async post_profile (req,res) {	

        const all_post = await post.findAll({  
                where: {
                    user_id: req.session.token,
                },
                raw: true,
                include: [user],
                order: [
                    ['time', 'DESC'],
                ],
        });

        return all_post;
    },

    async count_post (req,res, category) {	

        const num_post = await post.count({  
                where: {
                    p_area: category,
                },
                raw: true,
                order: [
                    ['time', 'DESC'],
                ],
        });

        return num_post;
    },
}

module.exports = model;