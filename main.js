const fs = require('fs');
const url = require('url');
const http = require('http');


fs.readdir(`./What`, (err,files)=>{
    
    let main_list='';
    files.forEach(element => {

        main_list = main_list + `<ul><li><a href="/${element}">${element}</a></li></ul>`;
    });
    
    http.createServer(function (req, res) {
        let _url = url.parse(req.url, true);
        let pathname =_url.pathname;
        let queryData = url.parse(req.url, true).query;

        let sub_list="";
        fs.readdir(`./What${pathname}`, (err,filename)=>{
            sub_list=sub_list + `<ul><li><a href="${pathname}/?id=${filename}">${filename}</a></li></ul>`;
            
            
            fs.readFile(`./What${pathname}/${queryData.id}`,'utf8', (err, file) => {
            //if (err) throw err;
                let content;
                    if (pathname=="/"){
                        content="Welcome!";
                        sub_list=""
                    } else if(file) {
                        content=file;
                    } else{
                        content="";
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
