const express = require('express');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const options = {
	host: 'localhost',
	user: 'root',
	password: '4321',
	database: 'diary1'
};
const sessionStore = new MySQLStore(options);

module.exports={
    session : function(){
        app.set('trust proxy', 1);
        app.use(session({
            secret: 'secret1@3@',
            resave: false,
            saveUninitialized: true,
            cookie: { 
                secure: true,
                httpOnly: true,
                maxAge: 1000*60*60*24*90
            },
            store : sessionStore
        }));
        return;
    }
}
