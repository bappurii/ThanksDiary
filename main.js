const fs = require('fs');
const url = require('url');
const http = require('http');
const qs = require('querystring');
const path=require('path')
const sanitizeHtml = require('sanitize-html');
const mysql= require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'user',
    password : 'qkqvnfl2',
    database : 'diary'
});
connection.connect();



fs.readdir(`./What`,"utf8", (err,dirName)=>{
    
    let main_list='';
    dirName.forEach(element => {
        main_list = main_list + `<ul><li><a href="/${element}">${element}</a></li></ul>`;
    });
    
    let server =http.createServer(function (req, res) {
        
        let pathname =url.parse(req.url, true).pathname;
        let queryData = url.parse(req.url, true).query;

        let sub_list="";
        fs.readdir(`./What${pathname}`,"utf8", (err,fileName)=>{
            if(fileName){
                fileName.forEach(element => {
                sub_list=sub_list + `<ul><li><a href="${pathname}?date=${element}">${element}</a></li></ul>`;
                })
            };
            

            fs.readFile(`./What${pathname}/${queryData.date}`,'utf8', (err, file) => {

                
                //sub_list & button
                if (pathname=="/") {
                    sub_list="";
                    button="";
                } else if(queryData.date){
                    button=`
                        <a href="${pathname}?process=new">new</a>
                        <a href="${pathname}?date=${queryData.date}&process=amend">amend</a>
                        <form action="${pathname}?date=${queryData.date}&process=deleting" method="post">
                            <input type="submit" value="delete">
                        </form>
                    `;
                } else{
                    button=`
                        <a href="${pathname}?process=new">new</a>
                    `;
                };

                //content

                function template (main_list, sub_list, button, content) {
                    return `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>PositiveDiary</title>
                    </head>
                    <body>
                        <h1><a href="/">Positive Diary</a></h1>
                        <nav>
                        ${main_list}
                        ${sub_list}
                        ${button}
                        </nav>
                        ${content}
                    </body>
                    </html>
                    `;
                }
                function normalRes(main_list, sub_list, button, content){
                    res.writeHead(200);
                    res.write(template(main_list, sub_list, button, content));
                    res.end();
                }
                    
                

                let content='';
                if (pathname =="/") {
                    content ="Welcome!";
                    normalRes(main_list, sub_list, button, content);
                } else if( !queryData.process){
                    if(file){
                        content=file;
                    }
                    normalRes(main_list, sub_list, button, content);
                } else if(queryData.process=="new") {
                    content = `
                    <form action="${pathname}?process=creating" method="post">
                        <p><input type="date" name="new_date"></p>
                        <p><textarea name="new_content" placeholder="content"></textarea></p>
                        <input type="submit" >
                    </form>
                    `;
                    normalRes(main_list, sub_list, button, content);
                } else if(queryData.process== "creating"){
                    
                    let body="";
                    req.on('data', function (data) {
                        body += data;
                        if (body.length > 1e6){
                            req.connection.destroy();
                        }
                        
                    });

                    req.on('end', function () {
                        var post = qs.parse(body);
                        let new_date = post.new_date;
                        let new_content= post.new_content;
                        fs.writeFile(path.join(__dirname,`./What/${pathname}`,new_date), new_content,"utf8",(err)=>{
                        });
                        res.writeHead(302, {Location: `${pathname}`});
                        res.end(template(main_list, sub_list, button, content));
                    });

                    

                } else if(queryData.process=="amend"){
                    content = `
                    <form action="${pathname}?date=${queryData.date}&process=amending" method="post">
                        <p><input type="date" name="new_date" placeholder="date" value="${queryData.date}"></p>
                        <p><textarea name="new_content">${file}</textarea></p>
                        <input type="submit" value="submit">
                    </form>
                    `;
                    normalRes(main_list, sub_list, button, content);
                } else if(queryData.process=="amending"){
                    let body="";
                    req.on('data', function (data) {
                        body += data;
                        if (body.length > 1e6){
                            req.connection.destroy();
                        }
                        
                    });
                    
                    req.on('end', function () {
                        var post = qs.parse(body);
                        let new_date = post.new_date;
                        let new_content= post.new_content;
                        fs.rename(`./What/${pathname}/${queryData.date}`, `./What/${pathname}/${new_date}`, (err)=>{
                            fs.writeFile(path.join(__dirname,`./What/${pathname}`,new_date), new_content,"utf8",(err)=>{
                                // let a=`localhost:${server.address().port}${pathname}?date=${new_date}`
                                res.writeHead(302, {Location: `${pathname}`});
                                res.end(template(main_list, sub_list, button, content));
                            });
                        });
                    });

                } else if (pathname.process="deleting"){
                        fs.unlink(`./What/${pathname}/${queryData.date}`,(err)=>{
                            // let a =`localhost:${server.address().port}${pathname}`
                            res.writeHead(302, {Location: `${pathname}`});
                            res.end(template(main_list, sub_list, button, content));
                        });
                        
                } else {
                    content = '';
                    normalRes(main_list, sub_list, button, content);
                }

                
                
            });
        });
    });
    server.listen(7000);  
});