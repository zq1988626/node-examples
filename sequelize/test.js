//引入框架
var Sequelize = require('sequelize');
//初始化链接（支持连接池）
var sequelize = new Sequelize('database', 'username', 'password',  {
  storage: 'database/database.sqlite',
  dialect: "sqlite"
});

sequelize
.authenticate()
.then(() => {
    console.log('测试连接成功');
})
.catch(err => {
    console.error('无法连接数据库:', err);
});

//定义数据模型
var User = sequelize.define('user', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE,
  birthday2: Sequelize.DATE,
});
//初始化数据
sequelize.sync()
.then(function() {
  return User.create({
    username: 'janedoe',
    birthday: new Date(1980, 6, 20),
    birthday2: new Date(1980, 6, 20)
  });
}).then(function(jane) {
  //获取数据
  console.log(jane.get({
    plain: true
  }));
}).catch(function (err) {
  //异常捕获
  console.log('Unable to connect to the database:', err);
});