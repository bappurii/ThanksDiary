
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

    }, button : function(pathname, queryData){
        if (pathname=="/" || pathname=="/create_ctg") {
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
        return button;
    }
    
}