

module.exports ={
    template : function (ctg_list, ctg_UD, date, button, content, loginStatus=false) {
        let login_tpl='login'    
        if (loginStatus){
                login_tpl='logout'
            }
        
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
            <a href="/auth/${login_tpl}">${login_tpl}</a>
            ${ctg_list}
            <a href="/ctg/ctg_create">+new category</a>
            ${ctg_UD}
            ${date}
            ${button}
            </nav>
            ${content}
        </body>
        </html>
        `;
        
        
    }, login_template : function(content){
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
    }, ctg_UD : function(req){
        return `
            <a href="/ctg/${req.params.ctg_id}/ctg_update">update category</a>
            <form action="/ctg/${req.params.ctg_id}/ctg_deleting" method="post">
                    <input type="submit" value="delete category">
            </form>
        `
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
                <a href="/ctg/${req.params.ctg_id}/content/${req.params.content_id}/cont_update">update</a>
                <form action="/ctg/${req.params.ctg_id}/content/${req.params.content_id}/cont_deleting" method="post">
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