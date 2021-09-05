const app = require('./app');

//////////// sequelize connection //////////
// instantiate sequelize
const Sequelize = require('sequelize');
const { promiseImpl } = require('ejs');
const { Op } = require("sequelize");
const uuid = require('uuid');
options = { multi: true };
const moment = require('moment-timezone');
const { DataTypes } = require("sequelize");

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
        type: Sequelize.STRING(500)
    },
    p_area: {
        type: Sequelize.STRING(50)
    },
    p_vote: {
        type: Sequelize.INTEGER
    },
    time: {
        type: Sequelize.STRING(50),
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

const vote = db.define('vote', {
    vote_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    post_id: {
        type: Sequelize.INTEGER,
    },
    user_id: {
        type: Sequelize.INTEGER,
    }
});

user.sync().then(() => {
    console.log('vote table created');
});

user.hasMany(post, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
    hooks:true })
post.belongsTo(user, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
    hooks:true })

user.hasMany(comment, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
    hooks:true })
comment.belongsTo(user, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
    hooks:true })

post.hasMany(comment, {
    foreignKey: 'post_id',
    onDelete: 'cascade',
    hooks:true })
comment.belongsTo(post, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
    hooks:true })

user.hasMany(vote, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
    hooks:true })
vote.belongsTo(user, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
    hooks:true })

post.hasMany(vote, {
    foreignKey: 'post_id',
    onDelete: 'cascade',
    hooks:true })
vote.belongsTo(post, {
    foreignKey: 'post_id',
    onDelete: 'cascade',
    hooks:true })

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

        return new_login;
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

            include: [
                {
                    model : comment,
                    attributes : [[Sequelize.fn('COUNT', Sequelize.col('comments.post_id')), 'comment']]
                },

                {
                    model : user,

                }
        ],
            group: ['post.post_id'],
            
            order: [
                ['time', 'DESC'],
            ],
    });
        return all_post;
    },

    async like (req,res) {//3

        const all_like = await post.findAll({
            raw: true,

            include: [
                {
                    model : vote,
                    attributes : [[Sequelize.fn('COUNT', Sequelize.col('votes.post_id')), 'like']]
                },
        ],
            group: ['post.post_id'],

            order: [
                ['time', 'DESC'],
            ],
    });

        return all_like;
    },
// llllllllllllllllllllllllllllllllllllllllllll
    async post_category (req,res, param) {	

        const all_post = await post.findAll({  
                where: {
                    p_area: param.category
                },
                raw: true,
                include: [
                   
                    {
                        model : comment,
                        attributes : [[Sequelize.fn('COUNT', Sequelize.col('comments.post_id')), 'comment']]
                    },
    
                    {
                        model : user,
    
                    }
                ],
                group: ['post.post_id'],
                order: [
                    ['time', 'DESC'],
                ],
        });

        return all_post;
    },

    async like_category (req,res,param) {//3

        const all_like = await post.findAll({
            where: {
                p_area: param.category
            },
            raw: true,
            include: [
                {
                    model : vote,
                    attributes : [[Sequelize.fn('COUNT', Sequelize.col('votes.post_id')), 'like']]
                },
        ],
            group: ['post.post_id'],

            order: [
                ['time', 'DESC'],
            ],
    });

        return all_like;
    },
    

    async post_search (req,res, param) {	

        const all_post = await post.findAll({
            where: {
                p_text: {
                    [Op.like]: '%' + param.search + '%'
                }
            },
            raw: true,
            include: [
                
                {
                    model : comment,
                    attributes : [[Sequelize.fn('COUNT', Sequelize.col('comments.post_id')), 'comment']]
                },

                {
                    model : user,

                }
            ],
            group: ['post.post_id'],
            order: [
                ['time', 'DESC'],
            ],
    });

        return all_post;
    },

    async like_search (req,res,param) {//3

        const all_like = await post.findAll({
            where: {
                p_text: {
                    [Op.like]: '%' + param.search + '%'
                }
            },
            raw: true,
            include: [
                {
                    model : vote,
                    attributes : [[Sequelize.fn('COUNT', Sequelize.col('votes.post_id')), 'like']]
                },
        ],
            group: ['post.post_id'],

            order: [
                ['time', 'DESC'],
            ],
    });

        return all_like;
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
            time : moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'),
            raw: true,
        });

        return new_post;
    },

    async like_post_check (req,res) {	

        const like_post_check = await vote.findAll({
            where: {
                user_id: req.session.token,
                post_id: req.body.post_id,
            },
            raw: true,
        });

        return like_post_check;
    },

    async like_post (req,res) {	

        const like_post = await vote.create({
            user_id: req.session.token,
            post_id: req.body.post_id,
            raw: true,
        });

        return like_post;
    },
    
    async dislike_post (req,res) {    //5

        const dislike_post = await vote.destroy({

            where: {
                user_id: req.session.token,
                post_id: req.body.post_id,
            },
            raw: true,
        });

        return dislike_post;
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

    async show_profile (req,res, param) {	

        const profile = await user.findAll({  
                where: {
                    user_id: param.user_id,
                },
                raw: true,
        });

        return profile[0];
    },

    async post_profile (req,res, param) {	

        const all_post = await post.findAll({  

                raw: true,
                include: [user],

                include: [
                    {
                        model : vote,
                        attributes : [[Sequelize.fn('COUNT', Sequelize.col('votes.post_id')), 'like']]
                    },

                    {
                        model : comment,
                        attributes : [[Sequelize.fn('COUNT', Sequelize.col('comments.post_id')), 'comment']]
                    },
                ],
                group: ['post.post_id'],

                where: {
                    user_id: param.user_id,
                },

                order: [
                    ['time', 'DESC'],
                ],
        });

        return all_post;
    },

    async count_post (req, res, category) {	

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

    async update_profile (req,res, param) {	

        const update_profile = await user.update(

            {
                mail: req.body.mail,
                school: req.body.school,
                class: req.body.class,
                department: req.body.department,
            },
            {where: { user_id: param.user_id }}
        );
            
        return update_profile;
    },

    async delete_post (req,res, param) {	

        const delete_post = await post.destroy({  
                where: {
                    post_id: param.post_id,
                },
        });

        return delete_post;
    },
}

module.exports = model;