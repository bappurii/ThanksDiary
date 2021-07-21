const fs = require('fs');
const url = require('url');
const http = require('http');
const qs = require('querystring');
const path=require('path')
const sanitizeHtml = require('sanitize-html');
const mysql= require('mysql');
const cn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'qkqvnfl2',
    database : 'diary'
});
cn.connect();


//ctg table

cn.query('select * from ctg', 
    function (error, results) {
        if (error) throw error;
        let ctg_list='';
        for (let i=0; i<results.length; i++){
            ctg_list = ctg_list + `<ul><li><a href="/ctg${results[i].id
            }">${results[i].category}</a></li></ul>`;
        }
        console.log(ctg_list);
    }
)



    


let server =http.createServer(function (req, res) {
    let pathname =url.parse(req.url, true).pathname;
    let queryData = url.parse(req.url, true).query;

    //date
    cn.query(`select date_format(date, "%y-%m-%d") as date, content from ${pathname.substring(1)}`, 
        function (error, results, fields) {
            if (error) throw error;
            
            let date='';
            for (let i=0; i<results.length; i++){
                date=date + `<ul><li><a href="${pathname}?date=${results[i].date}">${results[i].date}</a></li></ul>`
            };
        }
    )
})
server.listen(7000); 





//     let server =http.createServer(function (req, res) {
        
//         let pathname =url.parse(req.url, true).pathname;
//         let queryData = url.parse(req.url, true).query;

//         let date="";
//         fs.readdir(`./What${pathname}`,"utf8", (err,fileName)=>{
//             if(fileName){
//                 fileName.forEach(element => {
//                 date=date + `<ul><li><a href="${pathname}?date=${element}">${element}</a></li></ul>`;
//                 })
//             };
            

//             fs.readFile(`./What${pathname}/${queryData.date}`,'utf8', (err, file) => {

                
//                 //date & button
//                 if (pathname=="/") {
//                     date="";
//                     button="";
//                 } else if(queryData.date){
//                     button=`
//                         <a href="${pathname}?process=new">new</a>
//                         <a href="${pathname}?date=${queryData.date}&process=amend">amend</a>
//                         <form action="${pathname}?date=${queryData.date}&process=deleting" method="post">
//                             <input type="submit" value="delete">
//                         </form>
//                     `;
//                 } else{
//                     button=`
//                         <a href="${pathname}?process=new">new</a>
//                     `;
//                 };

//                 //content

//                 function template (ctg_list, date, button, content) {
//                     return `
//                     <!DOCTYPE html>
//                     <html>
//                     <head>
//                         <meta charset="UTF-8">
//                         <meta http-equiv="X-UA-Compatible" content="IE=edge">
//                         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                         <title>PositiveDiary</title>
//                     </head>
//                     <body>
//                         <h1><a href="/">Positive Diary</a></h1>
//                         <nav>
//                         ${ctg_list}
//                         ${date}
//                         ${button}
//                         </nav>
//                         ${content}
//                     </body>
//                     </html>
//                     `;
//                 }
//                 function normalRes(ctg_list, date, button, content){
//                     res.writeHead(200);
//                     res.write(template(ctg_list, date, button, content));
//                     res.end();
//                 }
                    
                

//                 let content='';
//                 if (pathname =="/") {
//                     content ="Welcome!";
//                     normalRes(ctg_list, date, button, content);
//                 } else if( !queryData.process){
//                     if(file){
//                         content=file;
//                     }
//                     normalRes(ctg_list, date, button, content);
//                 } else if(queryData.process=="new") {
//                     content = `
//                     <form action="${pathname}?process=creating" method="post">
//                         <p><input type="date" name="new_date"></p>
//                         <p><textarea name="new_content" placeholder="content"></textarea></p>
//                         <input type="submit" >
//                     </form>
//                     `;
//                     normalRes(ctg_list, date, button, content);
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
//                         res.end(template(ctg_list, date, button, content));
//                     });

                    

//                 } else if(queryData.process=="amend"){
//                     content = `
//                     <form action="${pathname}?date=${queryData.date}&process=amending" method="post">
//                         <p><input type="date" name="new_date" placeholder="date" value="${queryData.date}"></p>
//                         <p><textarea name="new_content">${file}</textarea></p>
//                         <input type="submit" value="submit">
//                     </form>
//                     `;
//                     normalRes(ctg_list, date, button, content);
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
//                                 res.end(template(ctg_list, date, button, content));
//                             });
//                         });
//                     });

//                 } else if (pathname.process="deleting"){
//                         fs.unlink(`./What/${pathname}/${queryData.date}`,(err)=>{
//                             // let a =`localhost:${server.address().port}${pathname}`
//                             res.writeHead(302, {Location: `${pathname}`});
//                             res.end(template(ctg_list, date, button, content));
//                         });
                        
//                 } else {
//                     content = '';
//                     normalRes(ctg_list, date, button, content);
//                 }

                
                
//             });
//         });
//     });
//     server.listen(7000);  
// });