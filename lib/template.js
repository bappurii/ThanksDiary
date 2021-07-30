

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
                <a href="/ctg_create">+new category</a>
                ${date}
                ${button}
                </nav>
                ${content}
            </body>
            </html>
            `;
        
        
    },  ctg_list: function(ctg_result){
        let list ='';
        if (ctg_result){
            for (let i=0; i<ctg_result.length; i++){
                list = list + `<ul><li><a href="/ctg/${ctg_result[i].id
                }">${ctg_result[i].category}</a></li></ul>`;
            }
        }
        return list;
    }, date: function(total_result){
        let date='';
        for (let i=0; i<total_result.length; i++){
            date=date + `<ul><li><a href="/ctg/${total_result[i].ctg_id}/content/${total_result[i].id}">${total_result[i].date}</a></li></ul>`
        }
        return date;
    },button : function(req){
        if(req.params.content_id){
            button=`
                <a href="/ctg/${req.params.ctg_id}/cont_create">create</a>
                <a href="${req.path}/cont_amend">amend</a>
                <form action="${req.path}/cont_deleting" method="post">
                    <input type="submit" value="delete">
                </form>
            `;
        } else{
            button=`
                <a href="/ctg/${req.params.ctg_id}/cont_create">create</a>
            `;
        };
        return button;
    }, 
    
    
}