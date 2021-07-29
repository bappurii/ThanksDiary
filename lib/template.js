
//trying ctg_list but fail

// const cn = require('./mysql.js');




// async function ctgf (){
    
//         cn.query('select * from ctg', 
//             async function (error, results) {
//                 if (error) throw error;
//                 let list ='';
//                 if (results){
//                     for (let i=0; i<results.length; i++){
//                         list = list + `<ul><li><a href="/ctg${results[i].id
//                         }">${results[i].category}</a></li></ul>`;
//                     }
//                 console.log('result'+ await list);
//                 return await list;
                
//                 }
//         })
    
// }
// console.log('final' + ctgf());


// async function a(
//     let value = await ctgf();
//     console.log(value);
// )
// a();



// function ctgf (){
//     return new Promise(resolve=>{
//         cn.query('select * from ctg', 
//             function (error, results) {
//                 if (error) throw error;
//                 let list ='';
//                 if (results){
//                     for (let i=0; i<results.length; i++){
//                         list = list + `<ul><li><a href="/ctg${results[i].id
//                         }">${results[i].category}</a></li></ul>`;
//                     }
//                 }
//                 console.log('for loop result'+ list);
//                 resolve(list);
//         });
//     })
// }



// // let getData= ctgf()
// // .then((result)=>{
// //     console.log('then'+ result);
// //     return result
// // })
// let a;
// // function getData(){
// //     ctgf().then((result)=>{
// //         console.log('then'+ result);
// //         a=result;
// //     }
// // }
// ctgf().then((result)=>{
//     console.log('then'+ result);
//     a=result;
// })
// console.log(a);

// // console.log('getdata '+getData());
        
// // async function a(
// //         let value = await ctgf();
// //         console.log(value);
// //     )         


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
    }, 
    
    
}