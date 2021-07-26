
module.exports ={
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
            <a href="/"><h1>Positive Diary</h1></a>
            <nav>
            ${ctg_list}
            <a href="/create_ctg">+new category</a>
            ${date}
            ${button}
            </nav>
            ${content}
        </body>
        </html>
        `;

    }, 
    
}