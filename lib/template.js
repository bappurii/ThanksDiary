
module.exports ={
    //template
    template : function (ctg_list, date, button, content) {
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
            ${ctg_list}
            ${date}
            ${button}
            </nav>
            ${content}
        </body>
        </html>
        `;
    },
    normalRes : function (ctg_list, date, button, content){
        res.writeHead(200);
        res.write(template(ctg_list, date, button, content));
        res.end();
    }
}

