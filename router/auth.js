// use other module
const tpl = require('../lib/template');
const cn=require('../lib/mysql');



// express
const express = require('express');
const router = express.Router()

router.get('/login', function (req, res){
    let content = `
        <form action="/auth/login_process" method="post">
            <p><input type="text" name="user_id" placeholder="email"></p>
            <p><input type="password" name="user_pwd" placeholder="password"></p>
            <input type="submit">
            <a href="/sign-up">sign-up</a>
        </form>
    `
    res.send(tpl.login_template(content));
})

router.post('/login_process', function (req, res){
    let user_id = req.body.user_id;
    let user_pwd = req.body.user_pwd;
    cn.query('select * from user where user.user_id=?',[user_id], function (err,results){
        if (err) throw err;
        if (results[0] && results[0].user_id == user_id && results[0].user_password ==user_pwd){
            req.session.loginStatus = true;
            req.session.save(()=>{
                res.redirect(`/`)
            });
        } else {
            res.send(tpl.login_template('Please Sign Up!'+'<a href=/auth/sign up>sign up</a>'));
        }
        console.log(req.session.loginStatus);
        
    })
})

router.get('/logout',function(req,res){
    delete req.session.loginStatus;
    req.session.save(()=>{
        res.redirect(`/`);
    });
});

module.exports=router;