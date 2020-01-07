const Sequelize = require('sequelize');

exports

// Option 1: Passing parameters separately
const sequelize = new Sequelize('mysql_test_db', 'root', '1234.abcd', {
  host: 'localhost',
  dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

//定义数据模型
var User = sequelize.define('user2', {
    id:{ type: Sequelize.STRING, primaryKey: true },
    username: Sequelize.STRING,
    birthday: Sequelize.DATE,
    birthday2: Sequelize.DATE,
});

sequelize
.authenticate()//连接
.then(() => {
    console.log('测试连接成功');
})
.catch(err => {
    console.error('无法连接数据库:', err);
})
.then(()=>sequelize.sync({ force: true })) //force: true 执行初始化
.then(()=>sequelize.sync()) //只连接不执行初始化
.then(()=> User.create(
    {id:"1",username: 'janedoe',birthday: new Date(1980, 6, 20),birthday2: new Date(1980, 6, 20)}
))
.then(jane => console.log(jane.get({plain: true})))
.catch(err => console.log('Unable to connect to the database:', err));