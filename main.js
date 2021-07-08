const fs = require('fs');
const url = require('url');
const http = require('http');
const qs = require('querystring');

fs.readdir(`./What`,"utf8", (err,dirName)=>{
    
    let main_list='';
    dirName.forEach(element => {
        main_list = main_list + `<ul><li><a href="/${element}">${element}</a></li></ul>`;
    });
    
    http.createServer(function (req, res) {
        let _url = url.parse(req.url, true);
        let pathname =_url.pathname;
        let queryData = url.parse(req.url, true).query;

        let sub_list="";
        fs.readdir(`./What${pathname}`,"utf8", (err,fileName)=>{
            if(fileName){
                fileName.forEach(element => {
                sub_list=sub_list + `<ul><li><a href="${pathname}?date=${element}">${element}</a></li></ul>`;
                })
            };
            
           
        fs.readFile(`./What${pathname}/${queryData.date}`,'utf8', (err, file) => {
            //>let onlyDate=queryData.date.slice[1];
            //>console.log(queryData.date);
            //>console.log(typeof queryData.date.slice(1));
            //sub_list & button
            if (pathname=="/") {
                //content="Welcome!";
                sub_list="";
                button="";
            } else if(queryData.date){
                //content=file;
                
                let datepath=queryData.date;
                // console.log(datepath);
                // let onlyDate=datepath.slice(1);
                // console.log(onlyDate);
                button=`
                    <a href="${pathname}?process=new">new</a>
                    <a href="${pathname}?date=${queryData.date}&process=amend">amend</a>
                    <form action="delete" method="post">
                        <input type="hidden" name="" value="">
                        <input type="submit" value="delete">
                    </form>
                `;
            } else{
                button=`
                    <a href="${pathname}?process=new">new</a>
                `;
            };

            //content
            let content;
            if (pathname =="/") {
                content ="Welcome!"

            } else if(queryData&&queryData.process=="new") {
                content = `
                <form action=${pathname}?process=new_process method="get">
                    <p><input type="date" name="new_date"></p>
                    <p><textarea name="new_content" placeholder="content"></textarea></p>
                    <input type="submit" >
                </form>
                `;
                
                let body="";
                req.on('data', function (data) {
                    body += data;
                    // if (body.length > 1e6){
                    //     req.connection.destroy();
                    // }
                    
                });
                console.log(body);
                req.on('end', function () {
                    var post = qs.parse(body);
                    console.log(JSON.parse(JSON.stringify(post)));
                    let new_date = post.new_date;
                    let new_content= post.new_content;
                    console.log(new_date);
                    console.log(new_content);
                    fs.writeFile(`${new_date}`, `${new_content}`,"utf8",(err)=>{
                        
                    });
                });

            } else if (pathname==`${pathname}?${queryData.date}&process=amend`){
                content = `
                <form>
                    <p><input type="date" name="date" placeholder="date"></p>
                    <p><textarea name="content" </p>
                </form>
                `;
            } else {
                content = '';
            }



            let template = `
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
            
            res.writeHead(200);
            res.write(template);
            res.end();
            });
        });
    }).listen(7000);    
});
