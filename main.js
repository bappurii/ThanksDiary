//my module
const tpl = require('./lib/template');
const cn=require('./lib/mysql');
const ctg=require('./router/ctg')

//other module
const sanitizeHtml = require('sanitize-html');

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
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const options = {
	host: 'localhost',
	user: 'root',
	password: '4321',
	database: 'diary1'
};
const sessionStore = new MySQLStore(options);
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





app.get('/favicon.ico', function (req, res) {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    return res.end();
})
app.get('/', function (req, res) {
    
    cn.query('select * from ctg', 
    function (error, ctg_results) {
        if (error) throw error;
        let ctg_list =tpl.ctg_list(ctg_results);
        res.send(tpl.template(ctg_list, tpl.ctg_UD(req), '', '', '', 'Hello!'));
    });
});

app.use('/ctg', ctg);
    
//ctg CUD
app.get('/ctg_create', function(req,res){
    content = `
        <form action="/ctg_creating" method="post">
            <p><input type="text" name="new_category" placeholder="new category"></p>
            <input type="submit" >
        </form>
        `;
    cn.query('select * from ctg', 
    function (error, ctg_results) {
        if (error) throw error;
        let ctg_list =tpl.ctg_list(ctg_results);
        res.send(tpl.template(ctg_list, '', '', '', content));
    })
})

app.post('/ctg_creating', function(req,res){
    let new_category=req.body.new_category;
    cn.query(`insert into ctg (category) values ("${new_category}")`,function (err){
        if (err) throw err;
        cn.query(`select last_insert_id() as ctg_id from ctg`,function (err, results) {
            if (err) throw err;
            cn.query('select * from ctg', 
            function (error, ctg_results) {
                let button = tpl.button(req);
                if (error) throw error;
                let ctg_list =tpl.ctg_list(ctg_results);
                res.send(tpl.template(ctg_list, '', '', button, ''));
            })
        });
    });
})


app.get('/ctg/:ctg_id/ctg_update',function(req, res){
    cn.query(`select * from ctg where id=?`,[`${req.params.ctg_id}`],function(err, results){
        if(err) throw err;
        content = `
        <form action="/ctg/${req.params.ctg_id}/ctg_updating" method="post">
            <p>
                
                <input type="text" name="new_category" value="${results[0].category}">
            </p>
            <input type="submit" >
        </form>
        `;
        cn.query('select * from ctg', 
        function (error, ctg_results) {
            if (error) throw error;
            let ctg_list =tpl.ctg_list(ctg_results);
            res.end(tpl.template(ctg_list, '', '', '', content));
        })
    })
})

app.post('/ctg/:ctg_id/ctg_updating',function(req, res){
    

    let new_category = req.body.new_category;

    //sanitize HTML
    const clean_category = sanitizeHtml(new_category, {
        allowedTags: [ 'b', 'i', 'em', 'strong', 'a','br' ],
    });

    //ctg update
    cn.query('update ctg set category=? where id=?',[`${clean_category}`, `${req.params.ctg_id}`], function(err){
        if (err) throw err;
        res.writeHead(302, {Location: `/ctg/${req.params.ctg_id}`});
        res.end();
    })    
})


app.post('/ctg/:ctg_id/ctg_deleting',function(req, res){
    cn.query('delete from ctg where id=?',[`${req.params.ctg_id}`])
    cn.query('delete from total where ctg_id=?',[`${req.params.ctg_id}`],function(err){
        if (err) throw err;
        res.writeHead(302, {Location: `/`});
        res.end();
    })
})

app.listen(7000);