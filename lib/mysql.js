const mysql= require('mysql');
const cn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'qkqvnfl2',
    database : 'diary1'
});
cn.connect();
module.exports = cn;