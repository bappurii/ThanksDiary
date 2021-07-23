const url = require('url');
const http = require('http');
const qs = require('querystring');
const mysql= require('mysql');
const tpl = require('./lib/template');
const { write } = require('fs');

const cn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'qkqvnfl2',
    database : 'diary1'
});
cn.connect();









let server =http.createServer(function (req, res) {
    let pathname =url.parse(req.url, true).pathname;
    let queryData = url.parse(req.url, true).query;

    if (req.url === '/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        return res.end();
    } 

    
    //button
    if (pathname=="/") {
        button="";
    } else if(queryData.id){
        button=`
            <a href="${pathname}?process=create">create</a>
            <a href="${pathname}?id=${queryData.id}&process=amend">amend</a>
            <form action="${pathname}?id=${queryData.id}&process=deleting" method="post">
                <input type="submit" value="delete">
            </form>
        `;
    } else{
        button=`
            <a href="${pathname}?process=create">create</a>
        `;
    };


    //ctg table
    cn.query('select * from ctg', 
    function (error, results) {
        if (error) throw error;
        let ctg_list='';
        for (let i=0; i<results.length; i++){
            ctg_list = ctg_list + `<ul><li><a href="/ctg${results[i].id
            }">${results[i].category}</a></li></ul>`;
        }

        console.log(pathname.substring(4));
        console.log(parseInt(pathname.substring(4)));

        //date
        let date = '';
        if (pathname !=="/"){
            cn.query(`select id, ctg_id, date_format(total.date, "%y-%m-%d") as date, content from total where ctg_id=${parseInt(pathname.substring(4))}`, 
            function (error, results) {
                if (error) throw error;
                for (let i=0; i<results.length; i++){
                    date=date + `<ul><li><a href="/ctg${results[i].ctg_id}/?id=${results[i].id}">${results[i].date}</a></li></ul>`
                }
            
        
        //     //content
        //     let content='';
        //     if (pathname =="/") {
        //         content ="Welcome!";
        //         tpl.normalRes(ctg_list, date, button, content);
        //     } else if(queryData.id){
        //         cn.query(`select content from total where id=${queryData.id}`,function (error, results, fields) {
        //             if (error) throw error;
        //             if (results[0].id){
        //                 content=results[0].id;
        //             }
        //         })
        //         tpl.normalRes(ctg_list, date, button, content);
        //     } else if(queryData.process=="create") {
        //         content = `
        //         <form action="${pathname}?process=creating" method="post">
        //             <p><input type="date" name="new_date"></p>
        //             <p><textarea name="new_content" placeholder="content"></textarea></p>
        //             <input type="submit" >
        //         </form>
        //         `;
        //         tpl.normalRes(ctg_list, date, button, content);
        //     } else if(queryData.process== "creating"){
        //         let body="";
        //         req.on('data', function (data) {
        //             body += data;
        //             if (body.length > 1e6){
        //                 req.cn.destroy();
        //             }
                    
        //         });

        //         req.on('end', function () {
        //             const post = qs.parse(body);
        //             let new_date = post.new_date;
        //             let new_content= post.new_content;
        //             cn.query(`insert into total (ctg_id, date, content) values (${pathname.substring(4)}, "${new_date}", "${new_content}")`)
        //             res.writeHead(302, {Location: `${pathname}`});
        //             res.end(tpl.template(ctg_list, date, button, content));
        //         });

        //     } else if(queryData.process=="amend"){
        //         content = `
        //         <form action="${pathname}?id=${queryData.id}&process=amending" method="post">
        //             <p><input type="date" name="new_date" placeholder="date" value="${queryData.date}"></p>
        //             <p><textarea name="new_content">${file}</textarea></p>
        //             <input type="submit" value="submit">
        //         </form>
        //         `;
        //         tpl.normalRes(ctg_list, date, button, content);

        //     } else if(queryData.process=="amending"){
        //         let body="";
        //         req.on('data', function (data) {
        //             body += data;
        //             if (body.length > 1e6){
        //                 req.cn.destroy();
        //             }
        //         });
                
        //         req.on('end', function () {
        //             const post = qs.parse(body);
        //             let new_date = post.new_date;
        //             let new_content= post.new_content;
        //             cn.query(`update total set date="${new_date}", content="${new_content}" where id=${queryData.id}`

        //             )
        //             res.writeHead(302, {Location: `${pathname}`});
        //             res.end(tpl.template(ctg_list, date, button, content));
        //         });
        //     } else if (pathname.process="deleting"){
        //         const answer = confirm("Are you sure to delete this?");
        //         if (answer) {
        //             cn.query(`delete from total where id=queryData.id`);
        //             res.writeHead(302, {Location: `${pathname}`});
        //             res.end(tpl.template(ctg_list, date, button, content));
        //         } else {
        //             res.writeHead(200, {Location: `${pathname}/?id=${queryData.id}`});
        //             res.end(tpl.template(ctg_list, date, button, content));
        //         }
        //     } else {
        //         content = '';
        //         tpl.normalRes(ctg_list, date, button, content);
        //     }
            res.write(
                `<!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>PositiveDiary</title>
                </head>
                <body>
                    <h1><a href="/">Positive Diary</a></h1>
                    ${ctg_list}
                    ${date}
                </body>
                </html>
                `
            )
            res.end();    
            });
        }
    });
});

server.listen(7000); 





//     let server =http.createServer(function (req, res) {
        
//         let pathname =url.parse(req.url, true).pathname;
//         let queryData = url.parse(req.url, true).query;

//         
            

//             fs.readFile(`./What${pathname}/${queryData.date}`,'utf8', (err, file) => {

                
//                 //date & button
//                 

//                 //content

//                
                    
                

//                 let content='';
//                 if (pathname =="/") {
//                     content ="Welcome!";
//                     tpl.normalRes(ctg_list, date, button, content);
//                 } else if( !queryData.process){
//                     if(file){
//                         content=file;
//                     }
//                     tpl.normalRes(ctg_list, date, button, content);
//                 } else if(queryData.process=="create") {
//                     content = `
//                     <form action="${pathname}?process=creating" method="post">
//                         <p><input type="date" name="new_date"></p>
//                         <p><textarea name="new_content" placeholder="content"></textarea></p>
//                         <input type="submit" >
//                     </form>
//                     `;
//                     tpl.normalRes(ctg_list, date, button, content);
//                 } else if(queryData.process== "creating"){
                    
//                     let body="";
//                     req.on('data', function (data) {
//                         body += data;
//                         if (body.length > 1e6){
//                             req.cn.destroy();
//                         }
                        
//                     });

//                     req.on('end', function () {
//                         var post = qs.parse(body);
//                         let new_date = post.new_date;
//                         let new_content= post.new_content;
//                         fs.writeFile(path.join(__dirname,`./What/${pathname}`,new_date), new_content,"utf8",(err)=>{
//                         });
//                         res.writeHead(302, {Location: `${pathname}`});
//                         res.end(tpl.template(ctg_list, date, button, content));
//                     });

                    

//                 } else if(queryData.process=="amend"){
//                     content = `
//                     <form action="${pathname}?id=${queryData.id}&process=amending" method="post">
//                         <p><input type="date" name="new_date" placeholder="date" value="${queryData.date}"></p>
//                         <p><textarea name="new_content">${file}</textarea></p>
//                         <input type="submit" value="submit">
//                     </form>
//                     `;
//                     tpl.normalRes(ctg_list, date, button, content);
//                 } else if(queryData.process=="amending"){
//                     let body="";
//                     req.on('data', function (data) {
//                         body += data;
//                         if (body.length > 1e6){
//                             req.cn.destroy();
//                         }
                        
//                     });
                    
//                     req.on('end', function () {
//                         var post = qs.parse(body);
//                         let new_date = post.new_date;
//                         let new_content= post.new_content;
//                         fs.rename(`./What/${pathname}/${queryData.date}`, `./What/${pathname}/${new_date}`, (err)=>{
//                             fs.writeFile(path.join(__dirname,`./What/${pathname}`,new_date), new_content,"utf8",(err)=>{
//                                 // let a=`localhost:${server.address().port}${pathname}?date=${new_date}`
//                                 res.writeHead(302, {Location: `${pathname}`});
//                                 res.end(tpl.template(ctg_list, date, button, content));
//                             });
//                         });
//                     });

//                 } else if (pathname.process="deleting"){
//     var answer = window.confirm("Save data?");
// if (answer) {
//     //some code
// }
// else {
//     //some code
// }
//                         fs.unlink(`./What/${pathname}/${queryData.date}`,(err)=>{
//                             // let a =`localhost:${server.address().port}${pathname}`
//                             res.writeHead(302, {Location: `${pathname}`});
//                             res.end(tpl.template(ctg_list, date, button, content));
//                         });
                        
//                 } else {
//                     content = '';
//                     tpl.normalRes(ctg_list, date, button, content);
//                 }

                
                
//             });
//         });
//     });
//     server.listen(7000);  
// });