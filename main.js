const fs = require('fs');
const url = require('url');
const http = require('http');
const qs = require('querystring');

fs.readdir(`./What`, (err,dirName)=>{
    
    let main_list='';
    dirName.forEach(element => {
        main_list = main_list + `<ul><li><a href="/${element}">${element}</a></li></ul>`;
    });
    
    http.createServer(function (req, res) {
        let _url = url.parse(req.url, true);
        let pathname =_url.pathname;
        let current_category = pathname.split("/")[0];
        let queryData = url.parse(req.url, true).query;

        let sub_list="";
        fs.readdir(`./What${pathname}`, (err,fileName)=>{
            if(fileName){
                fileName.forEach(element => {
                sub_list=sub_list + `<ul><li><a href="${pathname}/?id=${element}">${element}</a></li></ul>`;
                })
            };
            
           
        fs.readFile(`./What${current_category}/${queryData.id}`,'utf8', (err, file) => {
            
            //sub_list & button
            if (pathname=="/") {
                //content="Welcome!";
                sub_list="";
                button="";
            } else if(queryData.id){
                //content=file;
                button=`
                    <form action="new" method="post">
                        <input type="submit" value="new">
                    </form>
                    <a href="${current_category}/${queryData.id}/amend">amend</a>
                    <form action="delete" method="post">
                        <input type="hidden" name="" value="">
                        <input type="submit" value="delete">
                    </form>
                `;
            } else{
                button=`
                    <form action="${current_category}/new" method="post">
                        <input type="submit" value="new">
                    </form> 
                `;
            };


            //content
            let content;
            if (pathname =="/") {
                content ="Welcome!"

            } else if(pathname.includes("new")) {
                content = `
                <form action=${pathname}/new_process method="get">
                    <p><input type="date" name="date"></p>
                    <p><textarea name="new_content" placeholder="content"></textarea></p>
                    <input type="submit" >
                </form>
                `;
                
                let body;
                req.on('data', function (data) {
                    body += data;
                    if (body.length > 1e6){
                        req.connection.destroy();
                    }
                });
        
                req.on('end', function () {
                    var post = qs.parse(body);
                    let date = post.date;
                    let new_content= post.new_content;
                    fs.writeFile(`${date}`, new_content);
                });

            } else if (pathname==`${current_category}/${queryData.id}/amend`){
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
