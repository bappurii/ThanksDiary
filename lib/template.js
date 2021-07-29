

module.exports ={
    template : function (ctg_list, date, button, content) {
        
        //ctg table
    
        
            
            
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
        
        
    }, button : function(req){
        if (req.path=="/" || req.path=="/create_ctg") {
            button="";
        } else if(req.query.id){
            button=`
                <a href="${req.path}?process=create">create</a>
                <a href="${req.path}?id=${req.query.id}&process=amend">amend</a>
                <form action="${req.path}?id=${req.query.id}&process=deleting" method="post">
                    <input type="submit" value="delete">
                </form>
            `;
        } else{
            button=`
                <a href="${req.path}?process=create">create</a>
            `;
        };
        return button;
    }, ctg_list: function(ctg_result){
        let list ='';
        if (ctg_result){
            for (let i=0; i<ctg_result.length; i++){
                list = list + `<ul><li><a href="/ctg${ctg_result[i].id
                }">${ctg_result[i].category}</a></li></ul>`;
            }
        }
        return list;
    }
    
    
}