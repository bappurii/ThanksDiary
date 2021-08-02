// use other module
const tpl = require('../lib/template');
const cn=require('../lib/mysql');

// middleware

const sanitizeHtml = require('sanitize-html');

// express
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))



//ctg CUD
router.get('/ctg_create', function(req,res){
    content = `
        <form action="/ctg/ctg_creating" method="post">
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

router.post('/ctg_creating', function(req,res){
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


router.get('/:ctg_id/ctg_update',function(req, res){
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

router.post('/:ctg_id/ctg_updating',function(req, res){
    

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


router.post('/:ctg_id/ctg_deleting',function(req, res){
    cn.query('delete from ctg where id=?',[`${req.params.ctg_id}`])
    cn.query('delete from total where ctg_id=?',[`${req.params.ctg_id}`],function(err){
        if (err) throw err;
        res.writeHead(302, {Location: `/`});
        res.end();
    })
})


//read date & content
router.get('/:ctg_id', function (req,res){
    let button = tpl.button(req);
    cn.query('select * from ctg', 
    function (error, ctg_results) {
        if (error) throw error;
        let ctg_list =tpl.ctg_list(ctg_results);
        cn.query(`select id, ctg_id, date_format(total.date, "%y-%m-%d") as date, content from total where ctg_id=?`, [`${parseInt(req.params.ctg_id)}`],
            function (error, total_result) {
                if (error) throw error;
                let date_list=tpl.date(total_result);
                res.send(tpl.template(ctg_list, tpl.ctg_UD(req), date_list, button,''));
        })
    })
});

router.get('/:ctg_id/content/:content_id',function(req,res){
    let button = tpl.button(req);
    cn.query('select * from ctg', 
    function (error, ctg_results) {
        if (error) throw error;
        let ctg_list =tpl.ctg_list(ctg_results);
        cn.query(`select id, ctg_id, date_format(total.date, "%y-%m-%d") as date, content from total where ctg_id=?`, [`${parseInt(req.params.ctg_id)}`],
            function (error, total_result) {
                if (error) throw error;
                let date_list=tpl.date(total_result);
                cn.query(`select id, content from total where total.id=?`,[`${parseInt(req.params.content_id)}`],function (error, results) {
                    if (error) throw error;
                    content=results[0].content;
                    res.send(tpl.template(ctg_list, tpl.ctg_UD(req), date_list, button, content));
                });
        })
    })
})


//content CUD
router.get('/:ctg_id/cont_create',function(req,res){
    let today = new Date().toISOString().slice(0, 10);
    cn.query('select * from ctg', 
    function (error, ctg_results) {
        if (error) throw error;
        let ctg_list =tpl.ctg_list(ctg_results);
        content = `
        <form action="/ctg/${req.params.ctg_id}/cont_creating" method="post">
            <p><input type="date" name="new_date" value="${today}"></p>
            <p><textarea name="new_content" placeholder="content"></textarea></p>
            <input type="submit" >
        </form>
        `;
        res.send(tpl.template(ctg_list, tpl.ctg_UD(req), '', '', content));
    });
});

router.post('/:ctg_id/cont_creating',function(req,res){
    
    let new_date = req.body.new_date;
    let new_content= req.body.new_content;
    
    //space language change
    while (new_content.includes("\r")||new_content.includes("\n")){
        if(new_content.includes("\r\n")){
            new_content=new_content.replace("\r\n","<br>");
        } else if(new_content.includes("\n")){
            new_content=new_content.replace("\n","<br>");
        } else{
            new_content=new_content.replace("\r","<br>");
        }
    }

    //sanitize HTML
    const clean_content = sanitizeHtml(new_content, {
        allowedTags: [ 'b', 'i', 'em', 'strong', 'a','br' ],
    });

    //create
    cn.query(`insert into total (ctg_id, date, content) values (${parseInt(req.params.ctg_id)}, "${new_date}", "${new_content}")`,function (err){
        if (err) throw err;
        cn.query(`select last_insert_id() as id from total`,function (err, results) {
            if (err) throw err;
            res.writeHead(302, {Location: `/ctg/${req.params.ctg_id}/content/${results[0].id}`});
            res.end();
        });
    });
});
router.get('/:ctg_id/content/:content_id/cont_update',function(req, res){
    cn.query('select * from ctg', 
    function (error, ctg_results) {
        if (error) throw error;
        let ctg_list =tpl.ctg_list(ctg_results);
        cn.query(`select id, date_format(total.date, "%Y-%m-%d") as date, content from total where total.id=?`, [`${parseInt(req.params.content_id)}`] 
        ,function (error, results) {
        
        if (error) throw error;
        
        content = `
        <form action="/ctg/${req.params.ctg_id}/content/${req.params.content_id}/cont_updating" method="post">
            <p><input type="date" name="new_date" placeholder="date" value="${results[0].date}"></p>
            <p><textarea name="new_content">${results[0].content}</textarea></p>
            <input type="submit" value="submit">
        </form>
        `;
        res.send(tpl.template(ctg_list, tpl.ctg_UD(req), '', '', content));
        })
    })
})
router.post('/:ctg_id/content/:content_id/cont_updating',function(req, res){

    let new_date = req.body.new_date;
    let new_content= req.body.new_content;

    //space language change
    while (new_content.includes("\r")||new_content.includes("\n")){
        if(new_content.includes("\r\n")){
            new_content=new_content.replace("\r\n","<br>");
        } else if(new_content.includes("\n")){
            new_content=new_content.replace("\n","<br>");
        } else{
            new_content=new_content.replace("\r","<br>");
        }
    }
    //sanitize HTML
    const clean_content = sanitizeHtml(new_content, {
        allowedTags: [ 'b', 'i', 'em', 'strong', 'a','br' ],
    });

    //update
    cn.query(`update total set date="${new_date}", content="${new_content}" where id=?`,[`${parseInt(req.params.content_id)}`]);
    res.writeHead(302, {Location: `/ctg/${req.params.ctg_id}/content/${req.params.content_id}`});

    let button = tpl.button(req);
    cn.query('select * from ctg', 
    function (error, ctg_results) {
        if (error) throw error;
        let ctg_list =tpl.ctg_list(ctg_results);
        cn.query(`select id, ctg_id, date_format(total.date, "%y-%m-%d") as date, content from total where ctg_id=?`, [`${parseInt(req.params.ctg_id)}`],
        function (error, total_result) {
            if (error) throw error;
            let date_list=tpl.date(total_result);
            res.end(tpl.template(ctg_list, tpl.ctg_UD(req), date_list, button, clean_content));
        });
    });
})
router.post('/:ctg_id/content/:content_id/cont_deleting',function(req, res){
    cn.query(`delete from total where total.id=?`,[`${parseInt(req.params.content_id)}`]);
    res.writeHead(302, {Location: `/ctg/${req.params.ctg_id}`});
    res.end();
})





module.exports=router;