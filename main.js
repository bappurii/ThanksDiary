const url = require('url');
const http = require('http');
const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');

const tpl = require('./lib/template');
const cn=require('./lib/mysql');

const express = require('express');
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))


//Express

app.get('/favicon.ico', function (req, res) {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    return res.end();
})
app.get('/', function (req, res) {
    
    cn.query('select * from ctg', 
    function (error, ctg_results) {
        if (error) throw error;
        let ctg_list =tpl.ctg_list(ctg_results);
        res.send(tpl.template(ctg_list, '','', 'Hello!'));
    });
});
app.get('/ctg/:ctg_id', function (req,res){
    
    let button = tpl.button(req);
    cn.query('select * from ctg', 
    function (error, ctg_results) {
        if (error) throw error;
        let ctg_list =tpl.ctg_list(ctg_results);
        cn.query(`select id, ctg_id, date_format(total.date, "%y-%m-%d") as date, content from total where ctg_id=?`, [`${parseInt(req.params.ctg_id)}`],
            function (error, total_result) {
                if (error) throw error;
                let date_list=tpl.date(total_result);
                res.send(tpl.template(ctg_list, date_list, button,''));
        })
    })
});

//content read
app.get('/ctg/:ctg_id/content/:content_id',function(req,res){
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
                    res.send(tpl.template(ctg_list, date_list, button, content));
                });
        })
    })
})


//content CUD
app.get('/ctg/:ctg_id/cont_create',function(req,res){
    let today = new Date().toISOString().slice(0, 10);
    cn.query('select * from ctg', 
    function (error, ctg_results) {
        if (error) throw error;
        let ctg_list =tpl.ctg_list(ctg_results);
        content = `
        <form action="/ctg/${req.params.ctg_id}/cont_creating" method="get">
            <p><input type="date" name="new_date" value="${today}"></p>
            <p><textarea name="new_content" placeholder="content"></textarea></p>
            <input type="submit" >
        </form>
        `;
        res.send(tpl.template(ctg_list, '', '', content));
    });
});

app.post('/ctg/:ctg_id/cont_creating',function(req,res){
    
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
app.get('/ctg/:ctg_id/content/:content_id/cont_amend',function(req,res){
    cn.query('select * from ctg', 
    function (error, ctg_results) {
        if (error) throw error;
        let ctg_list =tpl.ctg_list(ctg_results);
        cn.query(`select id, date_format(total.date, "%Y-%m-%d") as date, content from total where total.id=?`, [`${parseInt(req.params.content_id)}`] 
        ,function (error, results) {
        
        if (error) throw error;
        
        content = `
        <form action="/ctg/${req.params.ctg_id}/content/${req.params.content_id}/cont_amending" method="post">
            <p><input type="date" name="new_date" placeholder="date" value="${results[0].date}"></p>
            <p><textarea name="new_content">${results[0].content}</textarea></p>
            <input type="submit" value="submit">
        </form>
        `;
        res.send(tpl.template(ctg_list, '', '', content));
        })
    })
})
app.post('/ctg/:ctg_id/content/:content_id/cont_amending',function(req,res){

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
            res.end(tpl.template(ctg_list, date_list, button, clean_content));
        });
    });
})
app.post('/ctg/:ctg_id/content/:content_id/cont_deleting',function(req,res){
    cn.query(`delete from total where total.id=?`,[`${parseInt(req.params.content_id)}`]);
    res.writeHead(302, {Location: `/ctg/${req.params.ctg_id}`});
    res.end();
})


//ctg
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
        res.send(tpl.template(ctg_list, '', '', content));
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
                res.send(tpl.template(ctg_list, '', button, ''));
            })
        });
    });
})


app.listen(7000);




// NodeJS + mySQL

//             //content

//             function normalRes (ctg_list, date, button, content){
//                 res.writeHead(200);
//                 res.write(tpl.template( ctg_list, date, button, content));
//                 res.end();
//             }

            
//             let content='';
//             if (pathname =="/") {
//                 content ="Welcome!";
//                 normalRes(ctg_list, date, button, content);
//             } else if(pathname == "/create_ctg"){
//                 content = `
//                     <form action="/creating_ctg" method="post">
//                         <p><input type="text" name="new_category" placeholder="new category"></p>
//                         <input type="submit" >
//                     </form>
//                 `;
//                 normalRes(ctg_list, date, button, content);
//              

//             } 
//             } else if (queryData.process=="deleting"){
                    
//                     cn.query(`delete from total where total.id=?`,[`${parseInt(queryData.id)}`]);
//                     res.writeHead(302, {Location: `${pathname}`});
//                     res.end(tpl.template( date, button, content));
                
//             } else {
//                 content = '';
//                 normalRes(ctg_list, date, button, content);
//             }
   
//             });
//         }
//     });
// });

// server.listen(7000); 