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
    
    let button = tpl.button(req);
    cn.query('select * from ctg', 
    function (error, ctg_results) {
        if (error) throw error;
        let ctg_list =tpl.ctg_list(ctg_results);
        res.send(tpl.template(ctg_list, '',button, 'Hello!'));
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
// else if(queryData.process=="create") {
    //                 let today = new Date().toISOString().slice(0, 10);
    //                 content = `
    //                 <form action="${pathname}?process=creating" method="post">
    //                     <p><input type="date" name="new_date" value="${today}"></p>
    //                     <p><textarea name="new_content" placeholder="content"></textarea></p>
    //                     <input type="submit" >
    //                 </form>
    //                 `;
    //                 normalRes(ctg_list, date, button, content);
    //             } else if(queryData.process== "creating"){
    //                 let body="";
    //                 req.on('data', function (data) {
    //                     body += data;
    //                     if (body.length > 1e6){
    //                         req.cn.destroy();
    //                     }
                        
    //                 });
    
    //                 req.on('end', function () {
                        
                        
    //                     const post = qs.parse(body);
    //                     let new_date = post.new_date;
    //                     let new_content= post.new_content;
    
    //                     //space language change
    //                     while (new_content.includes("\r")||new_content.includes("\n")){
    //                         if(new_content.includes("\r\n")){
    //                             new_content=new_content.replace("\r\n","<br>");
    //                         } else if(new_content.includes("\n")){
    //                             new_content=new_content.replace("\n","<br>");
    //                         } else{
    //                             new_content=new_content.replace("\r","<br>");
    //                         }
    //                     }
    
    //                     //sanitize HTML
    //                     const clean_content = sanitizeHtml(content, {
    //                         allowedTags: [ 'b', 'i', 'em', 'strong', 'a','br' ],
    //                     });
    
    //                     //create
    //                     cn.query(`insert into total (ctg_id, date, content) values (${parseInt(pathname.substring(4))}, "${new_date}", "${new_content}")`,function (err,results){
    //                         if (err) throw err;
    //                         cn.query(`select last_insert_id() as id from total`,function (err, results) {
    //                             if (err) throw err;
    //                             res.writeHead(302, {Location: `${pathname}?id=${results[0].id}`});
    //                             res.end(tpl.template(ctg_list, date, button, clean_content));
    //                         });
    //                     });
    //                 });
    


app.listen(7000);




// NodeJS + mySQL

// let server =http.createServer(function (req, res) {
//     let pathname =url.parse(req.url, true).pathname;
//     let queryData = url.parse(req.url, true).query;

//     if (req.url === '/favicon.ico') {
//         res.writeHead(200, {'Content-Type': 'image/x-icon'} );
//         return res.end();
//     } 

    
//     //button
//     let button= tpl.button(pathname,queryData);
    
    
//     //ctg table
    
//     cn.query('select * from ctg', 
//     function (error, results) {
//         if (error) throw error;
//         let ctg_list ='';
//         if (results){
//             for (let i=0; i<results.length; i++){
//                 ctg_list = ctg_list + `<ul><li><a href="/ctg${results[i].id
//                 }">${results[i].category}</a></li></ul>`;
//             }
//         }
    
    
        
    
//         //date
//         let date = '';
//         if (pathname !=="/"){
//             cn.query(`select id, ctg_id, date_format(total.date, "%y-%m-%d") as date, content from total where ctg_id=?`, [`${parseInt(pathname.substring(4))}`],
//             function (error, results) {
//                 if (error) throw error;
//                 for (let i=0; i<results.length; i++){
//                     date=date + `<ul><li><a href="/ctg${results[i].ctg_id}/?id=${results[i].id}">${results[i].date}</a></li></ul>`
//                 }
            
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
//             }else if(pathname == "/creating_ctg"){
//                 let body="";
//                 req.on('data', function (data) {
//                     body += data;
//                     if (body.length > 1e6){
//                         req.cn.destroy();
//                     }
                    
//                 });

//                 req.on('end', function () {
                    
//                     const post = qs.parse(body);
//                     let new_category = post.new_category;

                    
//                     cn.query(`insert into ctg (category) values ("${new_category}")`,function (err,results){
//                         if (err) throw err;
//                         cn.query(`select last_insert_id() as ctg_id from ctg`,function (err, results) {
//                             if (err) throw err;
//                             res.writeHead(302, {Location: `/ctg${results[0].ctg_id}`});
//                             res.end(tpl.template( date, button, content));
//                         });
//                     });
//                 });
//             } else if(queryData.id&&!queryData.process){
                
//                 cn.query(`select id, content from total where total.id=?`,[`${queryData.id}`],function (error, results) {
                    
//                     if (error) throw error;
                    
//                     content=results[0].content;
//                     normalRes(ctg_list, date, button, content);
//                 })
                
//             } else if(queryData.process=="create") {
//                 let today = new Date().toISOString().slice(0, 10);
//                 content = `
//                 <form action="${pathname}?process=creating" method="post">
//                     <p><input type="date" name="new_date" value="${today}"></p>
//                     <p><textarea name="new_content" placeholder="content"></textarea></p>
//                     <input type="submit" >
//                 </form>
//                 `;
//                 normalRes(ctg_list, date, button, content);
//             } else if(queryData.process== "creating"){
//                 let body="";
//                 req.on('data', function (data) {
//                     body += data;
//                     if (body.length > 1e6){
//                         req.cn.destroy();
//                     }
                    
//                 });

//                 req.on('end', function () {
                    
                    
//                     const post = qs.parse(body);
//                     let new_date = post.new_date;
//                     let new_content= post.new_content;

//                     //space language change
//                     while (new_content.includes("\r")||new_content.includes("\n")){
//                         if(new_content.includes("\r\n")){
//                             new_content=new_content.replace("\r\n","<br>");
//                         } else if(new_content.includes("\n")){
//                             new_content=new_content.replace("\n","<br>");
//                         } else{
//                             new_content=new_content.replace("\r","<br>");
//                         }
//                     }

//                     //sanitize HTML
//                     const clean_content = sanitizeHtml(content, {
//                         allowedTags: [ 'b', 'i', 'em', 'strong', 'a','br' ],
//                     });

//                     //create
//                     cn.query(`insert into total (ctg_id, date, content) values (${parseInt(pathname.substring(4))}, "${new_date}", "${new_content}")`,function (err,results){
//                         if (err) throw err;
//                         cn.query(`select last_insert_id() as id from total`,function (err, results) {
//                             if (err) throw err;
//                             res.writeHead(302, {Location: `${pathname}?id=${results[0].id}`});
//                             res.end(tpl.template(ctg_list, date, button, clean_content));
//                         });
//                     });
//                 });

//             } else if(queryData.process=="amend"){

//                 cn.query(`select id, date_format(total.date, "%Y-%m-%d") as date, content from total where total.id=?`, [`${queryData.id}`] 
//                     ,function (error, results) {
                    
//                     if (error) throw error;
                    
//                     content = `
//                     <form action="${pathname}?id=${queryData.id}&process=amending" method="post">
//                         <p><input type="date" name="new_date" placeholder="date" value="${results[0].date}"></p>
//                         <p><textarea name="new_content">${results[0].content}</textarea></p>
//                         <input type="submit" value="submit">
//                     </form>
//                     `;
//                     normalRes(ctg_list, date, button, content);
//                 })

//             } else if(queryData.process=="amending"){
//                 let body="";
//                 req.on('data', function (data) {
//                     body += data;
//                     if (body.length > 1e6){
//                         req.cn.destroy();
//                     }
//                 });
                
//                 req.on('end', function () {
//                     const post = qs.parse(body);
//                     let new_date = post.new_date;
//                     let new_content= post.new_content;
//                     //space language change
//                     while (new_content.includes("\r")||new_content.includes("\n")){
//                         if(new_content.includes("\r\n")){
//                             new_content=new_content.replace("\r\n","<br>");
//                         } else if(new_content.includes("\n")){
//                             new_content=new_content.replace("\n","<br>");
//                         } else{
//                             new_content=new_content.replace("\r","<br>");
//                         }
//                     }
//                      //sanitize HTML
//                     const clean_content = sanitizeHtml(content, {
//                         allowedTags: [ 'b', 'i', 'em', 'strong', 'a','br' ],
//                     });

//                     //update
//                     cn.query(`update total set date="${new_date}", content="${new_content}" where id=?`,[`${parseInt(queryData.id)}`]);
                    
//                     res.writeHead(302, {Location: `${pathname}?id=${queryData.id}`});
//                     res.end(tpl.template(ctg_list, date, button, clean_content));
//                 });
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