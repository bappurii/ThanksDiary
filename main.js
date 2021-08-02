//my module
const tpl = require('./lib/template');
// const cn=require('./lib/mysql');
const ctg=require('./router/ctg')
const auth=require('./router/auth')

//Express
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');



const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());


//session
const mysql= require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const options = {
	host: 'localhost',
	user: 'root',
	password: '4321',
	database: 'diary1'
};
const cn=mysql.createConnection(options);
cn.connect();
const sessionStore = new MySQLStore(options);
// app.set('trust proxy', 1);
app.use(session({
    secret: 'secret1@3@',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 360000*24,
    },
    store : sessionStore
}));




app.get('/favicon.ico', function (req, res) {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    return res.end();
})
app.get('/', function (req, res) {
    cn.query('select * from ctg', 
    function (error, ctg_results) {
        if (error) throw error;
        let ctg_list =tpl.ctg_list(ctg_results);
        res.send(tpl.template(ctg_list, tpl.ctg_UD(req), '', '', 'Hello!',req.session.loginStatus));
    });
});

app.use('/ctg', ctg);
app.use('/auth', auth);






app.listen(7000);