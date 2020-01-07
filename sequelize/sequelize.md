# Sequelize
```js
//安装
npm i sequelize
```

## 例子
```js
//引入框架
var Sequelize = require('sequelize');
//初始化链接（支持连接池）
var sequelize = new Sequelize('database', 'username', 'password',  {
  storage: 'database/database.sqlite',
  dialect: "sqlite"
});

sequelize.authenticate().then(() => {
    console.log('测试连接成功');
}).catch(err => {
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
  console.log(jane.get({plain: true}));
}).catch(function (err) {
  console.log('Unable to connect to the database:', err);
});
```
## 基本操作


### 查询
```js
// Find all users
User.findAll().then(users => {
  console.log("All users:", JSON.stringify(users, null, 4));
});

// Create a new user
User.create({ firstName: "Jane", lastName: "Doe" }).then(jane => {
  console.log("Jane's auto-generated ID:", jane.id);
});

// Delete everyone named "Jane"
User.destroy({
  where: {
    firstName: "Jane"
  }
}).then(() => {
  console.log("Done");
});

// Change everyone without a last name to "Doe"
User.update({ lastName: "Doe" }, {
  where: {
    lastName: null
  }
}).then(() => {
  console.log("Done");
});
```


### 驱动
```js
//安装一个 数据库驱动
# One of the following:
$ npm install --save pg pg-hstore # Postgres
$ npm install --save mysql2
$ npm install --save mariadb
$ npm install --save sqlite3
$ npm install --save tedious # Microsoft SQL Server
```
#### SQLite
```js
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'path/to/database.sqlite'
});
```

### 测试连接
```js
sequelize
.authenticate()
.then(() => {
    console.log('测试连接成功。');
})
.catch(err => {
    console.error('连接失败:', err);
});
```

### 关闭连接
```js
sequelize.close()
```

### 建模表
```js
//模型是一个扩展的类Sequelize.Model。模型可以用两种等效方式定义。第一个，有Sequelize.Model.init(attributes, options)：

const Model = Sequelize.Model;
class User extends Model {}
User.init({
  // attributes
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING
    // allowNull defaults to true
  }
}, {
  sequelize,
  modelName: 'user'
  // options
});

//或者，使用sequelize.define：

const User = sequelize.define('user', {
  // attributes
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING
    // allowNull defaults to true
  }
}, {
  // options
});
```

### 同步模型到数据库
```js
// Note: 使用 `force: true` ，如果存在将删除表
User.sync({ force: true }).then(() => {
  // Now the `users` 此时uers表已再数据库中创建
  return User.create({
    firstName: 'John',
    lastName: 'Hancock'
  });
});
```
### 一次同步所有模型到数据库
```js
sequelize.sync()
```

### 模型定义
#### 模型和表之间的映射
```js
//请使用该define方法。每列必须具有数据类型，请参阅有关数据类型的更多信息。

class Project extends Model {}
Project.init({
  title: Sequelize.STRING,
  description: Sequelize.TEXT
}, { sequelize, modelName: 'project' });

class Task extends Model {}
Task.init({
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  deadline: Sequelize.DATE
}, { sequelize, modelName: 'task' })


//除了数据类型之外，您还可以在每列上设置大量选项。
class Foo extends Model {}
Foo.init({
 // instantiating will automatically set the flag to true if not set
 flag: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },

 // default values for dates => current time
 myDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },

 // setting allowNull to false will add NOT NULL to the column, which means an error will be
 // thrown from the DB when the query is executed if the column is null. If you want to check that a value
 // is not null before querying the DB, look at the validations section below.
 title: { type: Sequelize.STRING, allowNull: false },

 // Creating two objects with the same value will throw an error. The unique property can be either a
 // boolean, or a string. If you provide the same string for multiple columns, they will form a
 // composite unique key.
 uniqueOne: { type: Sequelize.STRING,  unique: 'compositeIndex' },
 uniqueTwo: { type: Sequelize.INTEGER, unique: 'compositeIndex' },

 // The unique property is simply a shorthand to create a unique constraint.
 someUnique: { type: Sequelize.STRING, unique: true },

 // It's exactly the same as creating the index in the model's options.
 { someUnique: { type: Sequelize.STRING } },
 { indexes: [ { unique: true, fields: [ 'someUnique' ] } ] },

 // Go on reading for further information about primary keys
 identifier: { type: Sequelize.STRING, primaryKey: true },

 // autoIncrement can be used to create auto_incrementing integer columns
 incrementMe: { type: Sequelize.INTEGER, autoIncrement: true },

 // You can specify a custom column name via the 'field' attribute:
 fieldWithUnderscores: { type: Sequelize.STRING, field: 'field_with_underscores' },

 // It is possible to create foreign keys:
 bar_id: {
   type: Sequelize.INTEGER,

   references: {
     // This is a reference to another model
     model: Bar,

     // This is the column name of the referenced model
     key: 'id',

     // This declares when to check the foreign key constraint. PostgreSQL only.
     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
   }
 },

 // It is possible to add coments on columns for MySQL, PostgreSQL and MSSQL only
 commentMe: {
   type: Sequelize.INTEGER,

   comment: 'This is a column name that has a comment'
 }
}, {
  sequelize,
  modelName: 'foo'
});
```

## 时间戳
默认情况下，Sequelize将增加的属性createdAt和updatedAt你的模型，这样你就可以知道什么时候该数据库条目进入数据库，并当最后更新。
请注意，如果您使用的是Sequelize迁移，则需要在迁移定义中添加createdAt和updatedAt字段：
```js
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('my-table', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // Timestamps
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('my-table');
  },
}
```

## 开发
```js
//安装开发工具
npm i sequelize-cli
```
```js

//方式1.初始化项目
npx sequelize-cli init

//方式2.创建.sequelizerc
'use strict';
const path = require('path');
module.exports = {
  config: path.join(__dirname, 'database/config.json'),
  'migrations-path': path.join(__dirname, 'database/migrations'),
  'seeders-path': path.join(__dirname, 'database/seeders'),
};
//并按配置创建
//创建文件夹 models
//创建文件夹 database/migrations、database/seeders
```
```js
npx sequelize-cli db:create //mysql

//生成一个新model
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

//运行迁移
npx sequelize-cli db:migrate

//撤销最近的迁移
npx sequelize-cli db:migrate:undo
```

### 生命周期
```js
(1)
  beforeBulkCreate(instances, options)
  beforeBulkDestroy(options)
  beforeBulkUpdate(options)
(2)
  beforeValidate(instance, options)
(-)
  validate
(3)
  afterValidate(instance, options)
  - or -
  validationFailed(instance, options, error)
(4)
  beforeCreate(instance, options)
  beforeDestroy(instance, options)
  beforeUpdate(instance, options)
  beforeSave(instance, options)
  beforeUpsert(values, options)
(-)
  create
  destroy
  update
(5)
  afterCreate(instance, options)
  afterDestroy(instance, options)
  afterUpdate(instance, options)
  afterSave(instance, options)
  afterUpsert(created, options)
(6)
  afterBulkCreate(instances, options)
  afterBulkDestroy(options)
  afterBulkUpdate(options)
```
#### 使用钩子
```js
// Method 1 via the .init() method
class User extends Model {}
User.init({
  username: DataTypes.STRING,
  mood: {
    type: DataTypes.ENUM,
    values: ['happy', 'sad', 'neutral']
  }
}, {
  hooks: {
    beforeValidate: (user, options) => {
      user.mood = 'happy';
    },
    afterValidate: (user, options) => {
      user.username = 'Toni';
    }
  },
  sequelize
});

// Method 2 via the .addHook() method
User.addHook('beforeValidate', (user, options) => {
  user.mood = 'happy';
});

User.addHook('afterValidate', 'someCustomName', (user, options) => {
  return Promise.reject(new Error("I'm afraid I can't let you do that!"));
});

// Method 3 via the direct method
User.beforeCreate((user, options) => {
  return hashPassword(user.password).then(hashedPw => {
    user.password = hashedPw;
  });
});

User.afterValidate('myHookAfter', (user, options) => {
  user.username = 'Toni';
});
```

## 不同数据库差异化配置
Sequelize独立于特定方言。这意味着您必须自己将相应的连接器库安装到项目中。

### MySQL的
为了让Sequelize与MySQL一起很好地工作，你需要安装mysql2@^1.5.2或更高版本。一旦完成，您可以像这样使用它：
```js
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mysql'
})
```
注意：您可以通过设置dialectOptions参数将选项直接传递给方言库 。请参阅选项。

### MariaDB的
MariaDB的图书馆是mariadb。
```js
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mariadb',
  dialectOptions: {connectTimeout: 1000} // mariadb connector option
})
```
或使用连接字符串：

```js
const sequelize = new Sequelize('mariadb://user:password@example.com:9821/database')
```
### SQLite的
对于SQLite兼容性，您需要sqlite3@^4.0.0。像这样配置Sequelize：

```js
const sequelize = new Sequelize('database', 'username', 'password', {
  // sqlite! now!
  dialect: 'sqlite',

  // the storage engine for sqlite
  // - default ':memory:'
  storage: 'path/to/database.sqlite'
})
```
或者您也可以使用连接字符串和路径：

```js
const sequelize = new Sequelize('sqlite:/home/abs/path/dbname.db')
const sequelize = new Sequelize('sqlite:relativePath/dbname.db')
```
### PostgreSQL的
对于PostgreSQL，需要两个库，pg@^7.0.0和pg-hstore。你只需要定义方言：

```js
const sequelize = new Sequelize('database', 'username', 'password', {
  // gimme postgres, please!
  dialect: 'postgres'
})
```
要通过unix域套接字进行连接，请在host选项中指定套接字目录的路径。

套接字路径必须以/。

```js
const sequelize = new Sequelize('database', 'username', 'password', {
  // gimme postgres, please!
  dialect: 'postgres',
  host: '/path/to/socket_directory'
})
```
### MSSQL
MSSQL的库是tedious@^6.0.0你只需要定义方言：

```js
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mssql'
})
```

## 数据类型

### 内置数据类型
```js
Sequelize.STRING                      // VARCHAR(255)
Sequelize.STRING(1234)                // VARCHAR(1234)
Sequelize.STRING.BINARY               // VARCHAR BINARY
Sequelize.TEXT                        // TEXT
Sequelize.TEXT('tiny')                // TINYTEXT
Sequelize.CITEXT                      // CITEXT      PostgreSQL and SQLite only.

Sequelize.INTEGER                     // INTEGER
Sequelize.BIGINT                      // BIGINT
Sequelize.BIGINT(11)                  // BIGINT(11)

Sequelize.FLOAT                       // FLOAT
Sequelize.FLOAT(11)                   // FLOAT(11)
Sequelize.FLOAT(11, 10)               // FLOAT(11,10)

Sequelize.REAL                        // REAL        PostgreSQL only.
Sequelize.REAL(11)                    // REAL(11)    PostgreSQL only.
Sequelize.REAL(11, 12)                // REAL(11,12) PostgreSQL only.

Sequelize.DOUBLE                      // DOUBLE
Sequelize.DOUBLE(11)                  // DOUBLE(11)
Sequelize.DOUBLE(11, 10)              // DOUBLE(11,10)

Sequelize.DECIMAL                     // DECIMAL
Sequelize.DECIMAL(10, 2)              // DECIMAL(10,2)

Sequelize.DATE                        // DATETIME for mysql / sqlite, TIMESTAMP WITH TIME ZONE for postgres
Sequelize.DATE(6)                     // DATETIME(6) for mysql 5.6.4+. Fractional seconds support with up to 6 digits of precision
Sequelize.DATEONLY                    // DATE without time.
Sequelize.BOOLEAN                     // TINYINT(1)

Sequelize.ENUM('value 1', 'value 2')  // An ENUM with allowed values 'value 1' and 'value 2'
Sequelize.ARRAY(Sequelize.TEXT)       // Defines an array. PostgreSQL only.
Sequelize.ARRAY(Sequelize.ENUM)       // Defines an array of ENUM. PostgreSQL only.

Sequelize.JSON                        // JSON column. PostgreSQL, SQLite and MySQL only.
Sequelize.JSONB                       // JSONB column. PostgreSQL only.

Sequelize.BLOB                        // BLOB (bytea for PostgreSQL)
Sequelize.BLOB('tiny')                // TINYBLOB (bytea for PostgreSQL. Other options are medium and long)

Sequelize.UUID                        // UUID datatype for PostgreSQL and SQLite, CHAR(36) BINARY for MySQL (use defaultValue: Sequelize.UUIDV1 or Sequelize.UUIDV4 to make sequelize generate the ids automatically)

Sequelize.CIDR                        // CIDR datatype for PostgreSQL
Sequelize.INET                        // INET datatype for PostgreSQL
Sequelize.MACADDR                     // MACADDR datatype for PostgreSQL

Sequelize.RANGE(Sequelize.INTEGER)    // Defines int4range range. PostgreSQL only.
Sequelize.RANGE(Sequelize.BIGINT)     // Defined int8range range. PostgreSQL only.
Sequelize.RANGE(Sequelize.DATE)       // Defines tstzrange range. PostgreSQL only.
Sequelize.RANGE(Sequelize.DATEONLY)   // Defines daterange range. PostgreSQL only.
Sequelize.RANGE(Sequelize.DECIMAL)    // Defines numrange range. PostgreSQL only.

Sequelize.ARRAY(Sequelize.RANGE(Sequelize.DATE)) // Defines array of tstzrange ranges. PostgreSQL only.

Sequelize.GEOMETRY                    // Spatial column.  PostgreSQL (with PostGIS) or MySQL only.
Sequelize.GEOMETRY('POINT')           // Spatial column with geometry type. PostgreSQL (with PostGIS) or MySQL only.
Sequelize.GEOMETRY('POINT', 4326)     // Spatial column with geometry type and SRID.  PostgreSQL (with PostGIS) or MySQL only.

```

### 扩展数据类型
```js
// myproject/lib/sequelize.js

const Sequelize = require('Sequelize');
const sequelizeConfig = require('../config/sequelize')
const sequelizeAdditions = require('./sequelize-additions')

// Function that adds new datatypes
sequelizeAdditions(Sequelize)

// In this exmaple a Sequelize instance is created and exported
const sequelize = new Sequelize(sequelizeConfig)

modules.exports = sequelize
// myproject/lib/sequelize-additions.js

modules.exports = function sequelizeAdditions(Sequelize) {

  DataTypes = Sequelize.DataTypes

  /*
   * Create new types
   */
  class NEWTYPE extends DataTypes.ABSTRACT {
    // Mandatory, complete definition of the new type in the database
    toSql() {
      return 'INTEGER(11) UNSIGNED ZEROFILL'
    }

    // Optional, validator function
    validate(value, options) {
      return (typeof value === 'number') && (! Number.isNaN(value))
    }

    // Optional, sanitizer
    _sanitize(value) {
      // Force all numbers to be positive
      if (value < 0) {
        value = 0
      }

      return Math.round(value)
    }

    // Optional, value stringifier before sending to database
    _stringify(value) {
      return value.toString()
    }

    // Optional, parser for values received from the database
    static parse(value) {
      return Number.parseInt(value)
    }
  }

  // Mandatory, set key
  DataTypes.NEWTYPE.prototype.key = DataTypes.NEWTYPE.key = 'NEWTYPE'


  // Optional, disable escaping after stringifier. Not recommended.
  // Warning: disables Sequelize protection against SQL injections
  //DataTypes.NEWTYPE.escape = false

  // For convenience
  // `classToInvokable` allows you to use the datatype without `new`
  Sequelize.NEWTYPE = Sequelize.Utils.classToInvokable(DataTypes.NEWTYPE)

}
```


## 查询
### 字段名
要仅选择某些属性，可以使用该attributes选项。通常，您传递一个数组：

Model.findAll({
  attributes: ['foo', 'bar']
});
SELECT foo, bar ...
可以使用嵌套数组重命名属性：

Model.findAll({
  attributes: ['foo', ['bar', 'baz']]
});
SELECT foo, bar AS baz ...
您可以sequelize.fn用来进行聚合：

Model.findAll({
  attributes: [[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']]
});
SELECT COUNT(hats) AS no_hats ...
使用聚合函数时，必须为其指定别名才能从模型中访问它。在上面的例子中，你可以得到帽子的数量instance.get('no_hats')。

有时，如果您只想添加聚合，列出模型的所有属性可能会很烦人：

// This is a tiresome way of getting the number of hats...
Model.findAll({
  attributes: ['id', 'foo', 'bar', 'baz', 'quz', [sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']]
});

// This is shorter, and less error prone because it still works if you add / remove attributes
Model.findAll({
  attributes: { include: [[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']] }
});
SELECT id, foo, bar, baz, quz, COUNT(hats) AS no_hats ...
同样，也可以删除选定的几个属性：

Model.findAll({
  attributes: { exclude: ['baz'] }
});
SELECT id, foo, bar, quz ...
### where
无论您是使用findAll / find查询还是进行批量更新/销毁，都可以传递一个where对象来过滤查询。

where 通常从属性：值对中获取一个对象，其中value可以是相等匹配的基元，也可以是其他运算符的键控对象。

通过嵌套or和的集合也可以生成复杂的AND / OR条件and Operators。

基本
const Op = Sequelize.Op;

Post.findAll({
  where: {
    authorId: 2
  }
});
// SELECT * FROM post WHERE authorId = 2

Post.findAll({
  where: {
    authorId: 12,
    status: 'active'
  }
});
// SELECT * FROM post WHERE authorId = 12 AND status = 'active';

Post.findAll({
  where: {
    [Op.or]: [{authorId: 12}, {authorId: 13}]
  }
});
// SELECT * FROM post WHERE authorId = 12 OR authorId = 13;

Post.findAll({
  where: {
    authorId: {
      [Op.or]: [12, 13]
    }
  }
});
// SELECT * FROM post WHERE authorId = 12 OR authorId = 13;

Post.destroy({
  where: {
    status: 'inactive'
  }
});
// DELETE FROM post WHERE status = 'inactive';

Post.update({
  updatedAt: null,
}, {
  where: {
    deletedAt: {
      [Op.ne]: null
    }
  }
});
// UPDATE post SET updatedAt = null WHERE deletedAt NOT NULL;

Post.findAll({
  where: sequelize.where(sequelize.fn('char_length', sequelize.col('status')), 6)
});
// SELECT * FROM post WHERE char_length(status) = 6;
### 运算符
Sequelize公开了可用于创建更复杂比较的符号运算符 -

const Op = Sequelize.Op

[Op.and]: {a: 5}           // AND (a = 5)
[Op.or]: [{a: 5}, {a: 6}]  // (a = 5 OR a = 6)
[Op.gt]: 6,                // > 6
[Op.gte]: 6,               // >= 6
[Op.lt]: 10,               // < 10
[Op.lte]: 10,              // <= 10
[Op.ne]: 20,               // != 20
[Op.eq]: 3,                // = 3
[Op.not]: true,            // IS NOT TRUE
[Op.between]: [6, 10],     // BETWEEN 6 AND 10
[Op.notBetween]: [11, 15], // NOT BETWEEN 11 AND 15
[Op.in]: [1, 2],           // IN [1, 2]
[Op.notIn]: [1, 2],        // NOT IN [1, 2]
[Op.like]: '%hat',         // LIKE '%hat'
[Op.notLike]: '%hat'       // NOT LIKE '%hat'
[Op.iLike]: '%hat'         // ILIKE '%hat' (case insensitive) (PG only)
[Op.notILike]: '%hat'      // NOT ILIKE '%hat'  (PG only)
[Op.startsWith]: 'hat'     // LIKE 'hat%'
[Op.endsWith]: 'hat'       // LIKE '%hat'
[Op.substring]: 'hat'      // LIKE '%hat%'
[Op.regexp]: '^[h|a|t]'    // REGEXP/~ '^[h|a|t]' (MySQL/PG only)
[Op.notRegexp]: '^[h|a|t]' // NOT REGEXP/!~ '^[h|a|t]' (MySQL/PG only)
[Op.iRegexp]: '^[h|a|t]'    // ~* '^[h|a|t]' (PG only)
[Op.notIRegexp]: '^[h|a|t]' // !~* '^[h|a|t]' (PG only)
[Op.like]: { [Op.any]: ['cat', 'hat']}
                       // LIKE ANY ARRAY['cat', 'hat'] - also works for iLike and notLike
[Op.overlap]: [1, 2]       // && [1, 2] (PG array overlap operator)
[Op.contains]: [1, 2]      // @> [1, 2] (PG array contains operator)
[Op.contained]: [1, 2]     // <@ [1, 2] (PG array contained by operator)
[Op.any]: [2,3]            // ANY ARRAY[2, 3]::INTEGER (PG only)

[Op.col]: 'user.organization_id' // = "user"."organization_id", with dialect specific column identifiers, PG in this example
范围运算符
可以使用所有支持的运算符查询范围类型。

请记住，提供的范围值也可以 定义绑定的包含/排除 。

// All the above equality and inequality operators plus the following:

[Op.contains]: 2           // @> '2'::integer (PG range contains element operator)
[Op.contains]: [1, 2]      // @> [1, 2) (PG range contains range operator)
[Op.contained]: [1, 2]     // <@ [1, 2) (PG range is contained by operator)
[Op.overlap]: [1, 2]       // && [1, 2) (PG range overlap (have points in common) operator)
[Op.adjacent]: [1, 2]      // -|- [1, 2) (PG range is adjacent to operator)
[Op.strictLeft]: [1, 2]    // << [1, 2) (PG range strictly left of operator)
[Op.strictRight]: [1, 2]   // >> [1, 2) (PG range strictly right of operator)
[Op.noExtendRight]: [1, 2] // &< [1, 2) (PG range does not extend to the right of operator)
[Op.noExtendLeft]: [1, 2]  // &> [1, 2) (PG range does not extend to the left of operator)
### 组合
const Op = Sequelize.Op;

{
  rank: {
    [Op.or]: {
      [Op.lt]: 1000,
      [Op.eq]: null
    }
  }
}
// rank < 1000 OR rank IS NULL

{
  createdAt: {
    [Op.lt]: new Date(),
    [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
  }
}
// createdAt < [timestamp] AND createdAt > [timestamp]

{
  [Op.or]: [
    {
      title: {
        [Op.like]: 'Boat%'
      }
    },
    {
      description: {
        [Op.like]: '%boat%'
      }
    }
  ]
}
// title LIKE 'Boat%' OR description LIKE '%boat%'
### 运算符别名
Sequelize允许将特定字符串设置为运算符的别名。使用v5，这将为您提供弃用警告。

const Op = Sequelize.Op;
const operatorsAliases = {
  $gt: Op.gt
}
const connection = new Sequelize(db, user, pass, { operatorsAliases })

[Op.gt]: 6 // > 6
$gt: 6 // same as using Op.gt (> 6)
### 安全运算符
默认情况下，Sequelize将使用Symbol运算符。使用没有任何别名的Sequelize可以提高安全性。没有任何字符串别名将使注入运算符的可能性极小，但您应始终正确验证和清理用户输入。

一些框架会自动将用户输入解析为js对象，如果您无法清理输入，则可能会将带有字符串运算符的Object注入Sequelize。

为了更好的安全性，强烈建议使用符号从运营商Sequelize.Op一样Op.and/ Op.or在你的代码，而不是依赖于任何基于字符串的运营商如$and/ $or可言。您可以通过设置operatorsAliases选项来限制应用程序所需的别名，记住清理用户输入，特别是当您直接将它们传递给Sequelize方法时。

const Op = Sequelize.Op;

//use sequelize without any operators aliases
const connection = new Sequelize(db, user, pass, { operatorsAliases: false });

//use sequelize with only alias for $and => Op.and
const connection2 = new Sequelize(db, user, pass, { operatorsAliases: { $and: Op.and } });
Sequelize会警告你，如果你正在使用默认别名而不是限制它们，如果你想继续使用所有默认别名（不包括遗留别名）而没有警告你可以传递以下operatorAliases选项 -

const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

const connection = new Sequelize(db, user, pass, { operatorsAliases });
### JSON
JSON数据类型仅受PostgreSQL，SQLite，MySQL和MariaDB方言的支持。

#### PostgreSQL的
PostgreSQL中的JSON数据类型将值存储为纯文本，而不是二进制表示。如果您只想存储和检索JSON表示，则使用JSON将减少磁盘空间，并减少从其输入表示构建的时间。但是，如果要对JSON值执行任何操作，则应优先使用下面描述的JSONB数据类型。

#### MSSQL
MSSQL没有JSON数据类型，但它确实支持自SQL Server 2016以来通过某些函数存储为字符串的JSON。使用这些函数，您将能够查询存储在字符串中的JSON，但是任何返回的值都需要单独解析。

// ISJSON - to test if a string contains valid JSON
User.findAll({
  where: sequelize.where(sequelize.fn('ISJSON', sequelize.col('userDetails')), 1)
})

// JSON_VALUE - extract a scalar value from a JSON string
User.findAll({
  attributes: [[ sequelize.fn('JSON_VALUE', sequelize.col('userDetails'), '$.address.Line1'), 'address line 1']]
})

// JSON_VALUE - query a scalar value from a JSON string
User.findAll({
  where: sequelize.where(sequelize.fn('JSON_VALUE', sequelize.col('userDetails'), '$.address.Line1'), '14, Foo Street')
})

// JSON_QUERY - extract an object or array
User.findAll({
  attributes: [[ sequelize.fn('JSON_QUERY', sequelize.col('userDetails'), '$.address'), 'full address']]
})
### JSONB
可以通过三种不同的方式查询JSONB。

### 嵌套对象
{
  meta: {
    video: {
      url: {
        [Op.ne]: null
      }
    }
  }
}
### 嵌套密钥
{
  "meta.audio.length": {
    [Op.gt]: 20
  }
}
### 限制
{
  "meta": {
    [Op.contains]: {
      site: {
        url: 'http://google.com'
      }
    }
  }
}
### 关系/协会
// Find all projects with a least one task where task.state === project.state
Project.findAll({
    include: [{
        model: Task,
        where: { state: Sequelize.col('project.state') }
    }]
})
### 分页/限制
// Fetch 10 instances/rows
Project.findAll({ limit: 10 })

// Skip 8 instances/rows
Project.findAll({ offset: 8 })

// Skip 5 instances and fetch the 5 after that
Project.findAll({ offset: 5, limit: 5 })
### 排序
order采用一系列项目来订购查询或通过sequelize方法。通常，您将需要使用属性，方向或方向的元组/数组来确保正确转义。

Subtask.findAll({
  order: [
    // Will escape title and validate DESC against a list of valid direction parameters
    ['title', 'DESC'],

    // Will order by max(age)
    sequelize.fn('max', sequelize.col('age')),

    // Will order by max(age) DESC
    [sequelize.fn('max', sequelize.col('age')), 'DESC'],

    // Will order by  otherfunction(`col1`, 12, 'lalala') DESC
    [sequelize.fn('otherfunction', sequelize.col('col1'), 12, 'lalala'), 'DESC'],

    // Will order an associated model's created_at using the model name as the association's name.
    [Task, 'createdAt', 'DESC'],

    // Will order through an associated model's created_at using the model names as the associations' names.
    [Task, Project, 'createdAt', 'DESC'],

    // Will order by an associated model's created_at using the name of the association.
    ['Task', 'createdAt', 'DESC'],

    // Will order by a nested associated model's created_at using the names of the associations.
    ['Task', 'Project', 'createdAt', 'DESC'],

    // Will order by an associated model's created_at using an association object. (preferred method)
    [Subtask.associations.Task, 'createdAt', 'DESC'],

    // Will order by a nested associated model's created_at using association objects. (preferred method)
    [Subtask.associations.Task, Task.associations.Project, 'createdAt', 'DESC'],

    // Will order by an associated model's created_at using a simple association object.
    [{model: Task, as: 'Task'}, 'createdAt', 'DESC'],

    // Will order by a nested associated model's created_at simple association objects.
    [{model: Task, as: 'Task'}, {model: Project, as: 'Project'}, 'createdAt', 'DESC']
  ]

  // Will order by max age descending
  order: sequelize.literal('max(age) DESC')

  // Will order by max age ascending assuming ascending is the default order when direction is omitted
  order: sequelize.fn('max', sequelize.col('age'))

  // Will order by age ascending assuming ascending is the default order when direction is omitted
  order: sequelize.col('age')

  // Will order randomly based on the dialect (instead of fn('RAND') or fn('RANDOM'))
  order: sequelize.random()
})
### 表提示
tableHint可以用于在使用mssql时有选择地传递表提示。提示必须是来自的值，Sequelize.TableHints并且只应在绝对必要时使用。每个查询目前仅支持一个表提示。

表提示通过指定某些选项来覆盖mssql查询优化器的默认行为。它们仅影响该子句中引用的表或视图。

const TableHints = Sequelize.TableHints;

Project.findAll({
  // adding the table hint NOLOCK
  tableHint: TableHints.NOLOCK
  // this will generate the SQL 'WITH (NOLOCK)'
})
### 索引提示
indexHints可以用于在使用mysql时可选地传递索引提示。提示类型必须是值，Sequelize.IndexHints并且值应引用现有索引。

索引提示会覆盖mysql查询优化程序的默认行为。

Project.findAll({
  indexHints: [
    { type: IndexHints.USE, values: ['index_project_on_name'] }
  ],
  where: {
    id: {
      [Op.gt]: 623
    },
    name: {
      [Op.like]: 'Foo %'
    }
  }
})
将生成一个如下所示的mysql查询：

SELECT * FROM Project USE INDEX (index_project_on_name) WHERE name LIKE 'FOO %' AND id > 623;
Sequelize.IndexHints包括USE，FORCE，和IGNORE。


## 实例
### 构建非持久性实例
要创建已定义类的实例，请执行以下操作。如果您在过去编写Ruby，则可能会识别语法。使用build-method将返回未保存的对象，您必须保存该对象。

const project = Project.build({
  title: 'my awesome project',
  description: 'woot woot. this will make me a rich man'
})

const task = Task.build({
  title: 'specify the project idea',
  description: 'bla',
  deadline: new Date()
})
构建的实例在定义时会自动获取默认值：

// first define the model
class Task extends Model {}
Task.init({
  title: Sequelize.STRING,
  rating: { type: Sequelize.TINYINT, defaultValue: 3 }
}, { sequelize, modelName: 'task' });

// now instantiate an object
const task = Task.build({title: 'very important task'})

task.title  // ==> 'very important task'
task.rating // ==> 3
要将其存储在数据库中，请使用save-method并捕获事件...如果需要：

project.save().then(() => {
  // my nice callback stuff
})

task.save().catch(error => {
  // mhhh, wth!
})

// you can also build, save and access the object with chaining:
Task
  .build({ title: 'foo', description: 'bar', deadline: new Date() })
  .save()
  .then(anotherTask => {
    // you can now access the currently saved task with the variable anotherTask... nice!
  })
  .catch(error => {
    // Ooops, do some error-handling
  })
### 创建持久化实例
虽然创建的实例.build()需要将显式.save()调用存储在数据库中，但.create()完全省略该要求并在调用后自动存储实例的数据。

Task.create({ title: 'foo', description: 'bar', deadline: new Date() }).then(task => {
  // you can now access the newly created task via the variable task
})
也可以定义可以通过create方法设置哪些属性。如果您根据可由用户填写的表单创建数据库条目，这尤其非常方便。例如，使用它可以限制User模型只设置用户名和地址，但不能设置管理标志：

User.create({ username: 'barfooz', isAdmin: true }, { fields: [ 'username' ] }).then(user => {
  // let's assume the default of isAdmin is false:
  console.log(user.get({
    plain: true
  })) // => { username: 'barfooz', isAdmin: false }
})
### 更新/保存/保留实例
现在让我们更改一些值并保存对数据库的更改......有两种方法可以做到这一点：

// way 1
task.title = 'a very different title now'
task.save().then(() => {})

// way 2
task.update({
  title: 'a very different title now'
}).then(() => {})
save通过传递列名数组，还可以定义在调用时应保存哪些属性。当您基于先前定义的对象设置属性时，这非常有用。例如，如果您通过Web应用程序的形式获取对象的值。此外，它在内部使用update。这是它的样子：

task.title = 'foooo'
task.description = 'baaaaaar'
task.save({fields: ['title']}).then(() => {
 // title will now be 'foooo' but description is the very same as before
})

// The equivalent call using update looks like this:
task.update({ title: 'foooo', description: 'baaaaaar'}, {fields: ['title']}).then(() => {
 // title will now be 'foooo' but description is the very same as before
})
当您在save不更改任何属性的情况下调用时，此方法将不执行任

### 销毁/删除持久化实例
创建对象并获得对象后，可以从数据库中删除它。相关方法是destroy：

Task.create({ title: 'a task' }).then(task => {
  // now you see me...
  return task.destroy();
}).then(() => {
 // now i'm gone :)
})
如果paranoid选项为true，则不会删除该对象，而是将该deletedAt列设置为当前时间戳。要强制删除，您可以传递force: true给destroy调用：

task.destroy({ force: true })
在paranoid模式下软删除对象后，在强制删除旧实例之前，您将无法使用相同的主键创建新实例。

### 恢复软删除的实例
如果您使用以下方法软件删除了模型的实例paranoid: true，并且想要撤消删除，请使用以下restore方法：

Task.create({ title: 'a task' }).then(task => {
  // now you see me...
  return task.destroy();
}).then(() => {
  // now i'm gone, but wait...
  return task.restore();
})
### 批量工作（一次创建，更新和销毁多行）
除了更新单个实例外，您还可以一次创建，更新和删除多个实例。您正在寻找的功能被调用

Model.bulkCreate
Model.update
Model.destroy
由于您使用的是多个模型，因此回调函数不会返回DAO实例。BulkCreate将返回一个模型实例/ DAO数组，但它们不会create产生autoIncrement属性的结果值。update并且destroy将返回受影响的行数。

首先让我们看看bulkCreate

User.bulkCreate([
  { username: 'barfooz', isAdmin: true },
  { username: 'foo', isAdmin: true },
  { username: 'bar', isAdmin: false }
]).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
  return User.findAll();
}).then(users => {
  console.log(users) // ... in order to get the array of user objects
})
要一次更新多个行：

Task.bulkCreate([
  {subject: 'programming', status: 'executing'},
  {subject: 'reading', status: 'executing'},
  {subject: 'programming', status: 'finished'}
]).then(() => {
  return Task.update(
    { status: 'inactive' }, /* set attributes' value */
    { where: { subject: 'programming' }} /* where criteria */
  );
}).then(([affectedCount, affectedRows]) => {
  // Notice that affectedRows will only be defined in dialects which support returning: true

  // affectedCount will be 2
  return Task.findAll();
}).then(tasks => {
  console.log(tasks) // the 'programming' tasks will both have a status of 'inactive'
})
并删除它们：

Task.bulkCreate([
  {subject: 'programming', status: 'executing'},
  {subject: 'reading', status: 'executing'},
  {subject: 'programming', status: 'finished'}
]).then(() => {
  return Task.destroy({
    where: {
      subject: 'programming'
    },
    truncate: true /* this will ignore where and truncate the table instead */
  });
}).then(affectedRows => {
  // affectedRows will be 2
  return Task.findAll();
}).then(tasks => {
  console.log(tasks) // no programming, just reading :(
})
如果直接从用户接受值，则限制要实际插入的列可能会有所帮助。bulkCreate()接受选项对象作为第二个参数。该对象可以有一个fields参数（数组），让它知道您要显式构建的字段

User.bulkCreate([
  { username: 'foo' },
  { username: 'bar', admin: true}
], { fields: ['username'] }).then(() => {
  // nope bar, you can't be admin!
})
bulkCreate最初是一种插入记录的主流/快速方式，但是，有时你甚至希望能够一次插入多行而不牺牲模型验证，即使你明确告诉Sequelize要筛选哪些列。您可以通过向validate: true选项对象添加属性来完成。

class Tasks extends Model {}
Tasks.init({
  name: {
    type: Sequelize.STRING,
    validate: {
      notNull: { args: true, msg: 'name cannot be null' }
    }
  },
  code: {
    type: Sequelize.STRING,
    validate: {
      len: [3, 10]
    }
  }
}, { sequelize, modelName: 'tasks' })

Tasks.bulkCreate([
  {name: 'foo', code: '123'},
  {code: '1234'},
  {name: 'bar', code: '1'}
], { validate: true }).catch(errors => {
  /* console.log(errors) would look like:
  [
    { record:
    ...
    name: 'SequelizeBulkRecordError',
    message: 'Validation error',
    errors:
      { name: 'SequelizeValidationError',
        message: 'Validation error',
        errors: [Object] } },
    { record:
      ...
      name: 'SequelizeBulkRecordError',
      message: 'Validation error',
      errors:
        { name: 'SequelizeValidationError',
        message: 'Validation error',
        errors: [Object] } }
  ]
  */
})
### 实例的值
如果您记录一个实例，您会注意到，还有很多其他内容。为了隐藏这些东西并将其减少为非常有趣的信息，您可以使用get-attribute。使用option plain= true 调用它只会返回实例的值。

Person.create({
  name: 'Rambow',
  firstname: 'John'
}).then(john => {
  console.log(john.get({
    plain: true
  }))
})

// result:

// { name: 'Rambow',
//   firstname: 'John',
//   id: 1,
//   createdAt: Tue, 01 May 2012 19:12:16 GMT,
//   updatedAt: Tue, 01 May 2012 19:12:16 GMT
// }
提示：您还可以使用将实例转换为JSON JSON.stringify(instance)。这将基本上返回相同的values。

### 重新加载实例
如果需要同步实例，可以使用该方法reload。它将从数据库中获取当前数据并覆盖调用该方法的模型的属性。

Person.findOne({ where: { name: 'john' } }).then(person => {
  person.name = 'jane'
  console.log(person.name) // 'jane'

  person.reload().then(() => {
    console.log(person.name) // 'john'
  })
})
### 递增
为了增加实例的值而不会遇到并发问题，您可以使用increment。

首先，您可以定义一个字段以及要添加到其中的值。

User.findByPk(1).then(user => {
  return user.increment('my-integer-field', {by: 2})
}).then(user => {
  // Postgres will return the updated user by default (unless disabled by setting { returning: false })
  // In other dialects, you'll want to call user.reload() to get the updated instance...
})
其次，您可以定义多个字段以及要添加到其中的值。

User.findByPk(1).then(user => {
  return user.increment([ 'my-integer-field', 'my-very-other-field' ], {by: 2})
}).then(/* ... */)
第三，您可以定义包含字段及其增量值的对象。

User.findByPk(1).then(user => {
  return user.increment({
    'my-integer-field':    2,
    'my-very-other-field': 3
  })
}).then(/* ... */)
### 递减
为了减少实例的值而不遇到并发问题，您可以使用decrement。

首先，您可以定义一个字段以及要添加到其中的值。

User.findByPk(1).then(user => {
  return user.decrement('my-integer-field', {by: 2})
}).then(user => {
  // Postgres will return the updated user by default (unless disabled by setting { returning: false })
  // In other dialects, you'll want to call user.reload() to get the updated instance...
})
其次，您可以定义多个字段以及要添加到其中的值。

User.findByPk(1).then(user => {
  return user.decrement([ 'my-integer-field', 'my-very-other-field' ], {by: 2})
}).then(/* ... */)
第三，您可以定义包含字段及其减量值的对象。

User.findByPk(1).then(user => {
  return user.decrement({
    'my-integer-field':    2,
    'my-very-other-field': 3
  })
}).then(/* ... */)



## 事务
Sequelize支持两种使用事务的方式：

一个会根据promise链的结果自动提交或回滚事务，并且（如果启用）将事务传递给回调中的所有调用
然后离开提交，回滚并将事务传递给用户。
关键区别在于托管事务使用回调，该回调期望在非托管事务返回承诺时将承诺返回给它。

### 托管事务（自动回拨）
托管事务处理自动提交或回滚事务。您通过将回调传递给托管事务来启动托管事务sequelize.transaction。

注意传递的回调如何transaction返回一个promise链，并且没有显式调用t.commit()nor t.rollback()。如果已成功解析返回链中的所有promise，则提交事务。如果拒绝了一个或多个承诺，则回滚该事务。

return sequelize.transaction(t => {

  // chain all your queries here. make sure you return them.
  return User.create({
    firstName: 'Abraham',
    lastName: 'Lincoln'
  }, {transaction: t}).then(user => {
    return user.setShooter({
      firstName: 'John',
      lastName: 'Boothe'
    }, {transaction: t});
  });

}).then(result => {
  // Transaction has been committed
  // result is whatever the result of the promise chain returned to the transaction callback
}).catch(err => {
  // Transaction has been rolled back
  // err is whatever rejected the promise chain returned to the transaction callback
});
### 抛出错误以进行回滚
当使用管理的事务，你应该从来没有提交或手动回滚事务。如果所有查询都成功，但您仍希望回滚事务（例如，由于验证失败），则应抛出错误以中断并拒绝链：

return sequelize.transaction(t => {
  return User.create({
    firstName: 'Abraham',
    lastName: 'Lincoln'
  }, {transaction: t}).then(user => {
    // Woops, the query was successful but we still want to roll back!
    throw new Error();
  });
});
### 自动将事务传递给所有查询
在上面的示例中，通过{ transaction: t }作为第二个参数传递，仍然手动传递事务。要自动将事务传递给所有查询，必须安装continuation local storage（CLS）模块并在您自己的代码中实例化命名空间：

const cls = require('continuation-local-storage'),
    namespace = cls.createNamespace('my-very-own-namespace');
要启用CLS，您必须通过使用sequelize构造函数的静态方法告诉sequelize使用哪个命名空间：

const Sequelize = require('sequelize');
Sequelize.useCLS(namespace);

new Sequelize(....);
请注意，该useCLS()方法在构造函数上，而不在sequelize的实例上。这意味着所有实例将共享相同的命名空间，并且该CLS是全有或全无 - 您不能仅为某些实例启用它。

CLS的工作方式类似于回调的线程本地存储。这在实践中意味着不同的回调链可以通过使用CLS命名空间来访问局部变量。启用CLS时，sequelize将transaction在创建新事务时在命名空间上设置属性。由于回调链中设置的变量对该链是私有的，因此几个并发事务可以同时存在：

sequelize.transaction((t1) => {
  namespace.get('transaction') === t1; // true
});

sequelize.transaction((t2) => {
  namespace.get('transaction') === t2; // true
});
在大多数情况下，您不需要namespace.get('transaction')直接访问，因为所有查询都将自动在命名空间中查找事务：

sequelize.transaction((t1) => {
  // With CLS enabled, the user will be created inside the transaction
  return User.create({ name: 'Alice' });
});
在你使用Sequelize.useCLS()了sequelize返回的所有promises后，将修补以维护CLS上下文。CLS是一个复杂的主题 - cls-bluebird文档中的更多细节，用于制作蓝鸟承诺的补丁与CLS一起使用。

注意：当使用cls-hooked包时， _ CLS目前仅支持async / await。虽然，cls-hooked依赖于实验API async_hooks _

### 并发/部分事务
您可以在一系列查询中拥有并发事务，或者将其中一些事务从任何事务中排除。使用该{transaction: }选项可以控制查询所属的事务：

警告： SQLite不同时支持多个事务。

没有启用CLS
sequelize.transaction((t1) => {
  return sequelize.transaction((t2) => {
    // With CLS enable, queries here will by default use t2
    // Pass in the `transaction` option to define/alter the transaction they belong to.
    return Promise.all([
        User.create({ name: 'Bob' }, { transaction: null }),
        User.create({ name: 'Mallory' }, { transaction: t1 }),
        User.create({ name: 'John' }) // this would default to t2
    ]);
  });
});
### 隔离级别
启动事务时可能使用的隔离级别：

Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED // "READ UNCOMMITTED"
Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED // "READ COMMITTED"
Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ  // "REPEATABLE READ"
Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE // "SERIALIZABLE"
默认情况下，sequelize使用数据库的隔离级别。如果要使用不同的隔离级别，请将所需级别作为第一个参数传递：

return sequelize.transaction({
  isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, (t) => {

  // your transactions

  });
注意： 在MSSQL的情况下不会记录SET ISOLATION LEVEL查询，因为指定的isolationLevel直接传递给单调乏味

### 非托管事务（然后回调）
非托管事务会强制您手动回滚或提交事务。如果您不这样做，交易将挂起，直到超时。要启动非托管事务，请在sequelize.transaction()没有回调的情况下调用（您仍然可以传递选项对象）并调用then返回的promise。请注意commit()并rollback()返回一个promise。

return sequelize.transaction().then(t => {
  return User.create({
    firstName: 'Bart',
    lastName: 'Simpson'
  }, {transaction: t}).then(user => {
    return user.addSibling({
      firstName: 'Lisa',
      lastName: 'Simpson'
    }, {transaction: t});
  }).then(() => {
    return t.commit();
  }).catch((err) => {
    return t.rollback();
  });
});
选项
transaction可以使用options对象作为第一个参数调用该方法，该参数允许配置事务。

return sequelize.transaction({ /* options */ });
可以使用以下选项（及其默认值）：

{
  isolationLevel: 'REPEATABLE_READ',
  deferrable: 'NOT DEFERRABLE' // implicit default of postgres
}
isolationLevel可以在初始化Sequelize实例时全局设置，也可以在本地为每个事务设置：

// globally
new Sequelize('db', 'user', 'pw', {
  isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
});

// locally
sequelize.transaction({
  isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
});
该deferrable选项在事务启动后触发另一个查询，可选择将约束检查设置为延迟或立即。请注意，这仅在PostgreSQL中受支持。

sequelize.transaction({
  // to defer all constraints:
  deferrable: Sequelize.Deferrable.SET_DEFERRED,

  // to defer a specific constraint:
  deferrable: Sequelize.Deferrable.SET_DEFERRED(['some_constraint']),

  // to not defer constraints:
  deferrable: Sequelize.Deferrable.SET_IMMEDIATE
})
### 用于其他续集方法
该transaction选项与大多数其他选项一起使用，这通常是方法的第一个参数。对于采用值的方法，例如.create，.update()等transaction应该传递给第二个参数中的选项。如果不确定，请参阅API文档以了解您使用的方法以确保签名。

提交挂钩后
一个transaction对象可如果当它致力于跟踪。

一个afterCommit钩可以添加到托管和非托管交易对象：

sequelize.transaction(t => {
  t.afterCommit((transaction) => {
    // Your logic
  });
});

sequelize.transaction().then(t => {
  t.afterCommit((transaction) => {
    // Your logic
  });

  return t.commit();
})
传递给的函数afterCommit可以选择性地返回一个promise，该promise将在创建事务的promise链解析之前解析

afterCommit如果事务被回滚，则不会引发钩子

afterCommit与标准钩子不同，钩子不会修改事务的返回值

您可以将afterCommit钩子与模型钩子结合使用，以了解实例何时保存并在事务外部可用

model.afterSave((instance, options) => {
  if (options.transaction) {
    // Save done within a transaction, wait until transaction is committed to
    // notify listeners the instance has been saved
    options.transaction.afterCommit(() => /* Notify */)
    return;
  }
  // Save done outside a transaction, safe for callers to fetch the updated model
  // Notify
})
锁
transaction可以使用锁执行a中的查询

return User.findAll({
  limit: 1,
  lock: true,
  transaction: t1
})
事务中的查询可以跳过锁定的行

return User.findAll({
  limit: 1,
  lock: true,
  skipLocked: true,
  transaction: t2
})


## 作用域
作用域允许您定义以后可以轻松使用的常用查询。范围可以包括所有相同的属性定期发现者，where，include，limit等。

### 定义
范围在模型定义中定义，可以是finder对象，也可以是返回finder对象的函数 - 除了默认范围外，它只能是一个对象：

class Project extends Model {}
Project.init({
  // Attributes
}, {
  defaultScope: {
    where: {
      active: true
    }
  },
  scopes: {
    deleted: {
      where: {
        deleted: true
      }
    },
    activeUsers: {
      include: [
        { model: User, where: { active: true }}
      ]
    },
    random () {
      return {
        where: {
          someNumber: Math.random()
        }
      }
    },
    accessLevel (value) {
      return {
        where: {
          accessLevel: {
            [Op.gte]: value
          }
        }
      }
    }
    sequelize,
    modelName: 'project'
  }
});
您还可以在通过调用定义模型后添加范围addScope。这对于包含include的范围特别有用，其中include中的模型可能在定义其他模型时未定义。

始终应用默认范围。这意味着，使用上面的模型定义，Project.findAll()将创建以下查询：

SELECT * FROM projects WHERE active = true
默认范围可以通过调用被删除.unscoped()，.scope(null)或者通过调用另一个范围：

Project.scope('deleted').findAll(); // Removes the default scope
SELECT * FROM projects WHERE deleted = true
也可以在范围定义中包含范围模型。这可以让你避免重复include，attributes或where定义。使用上面的示例，并active在包含的User模型上调用范围（而不是直接在该include对象中指定条件）：

activeUsers: {
  include: [
    { model: User.scope('active')}
  ]
}
### 用法
通过调用.scope模型定义，传递一个或多个范围的名称来应用范围。.scope返回与所有的常规方法，一个功能齐全的模型实例：.findAll，.update，.count，.destroy等您可以保存此模型的实例，并且之后重用它：

const DeletedProjects = Project.scope('deleted');

DeletedProjects.findAll();
// some time passes

// let's look for deleted projects again!
DeletedProjects.findAll();
范围适用于.find，.findAll，.count，.update，.increment和.destroy。

可以通过两种方式调用作为函数的作用域。如果作用域不接受任何参数，则可以正常调用它。如果范围采用参数，则传递一个对象：

Project.scope('random', { method: ['accessLevel', 19]}).findAll();
SELECT * FROM projects WHERE someNumber = 42 AND accessLevel >= 19
合并
通过将范围数组传递给.scope或通过将范围作为连续参数传递，可以同时应用多个范围。

// These two are equivalent
Project.scope('deleted', 'activeUsers').findAll();
Project.scope(['deleted', 'activeUsers']).findAll();
SELECT * FROM projects
INNER JOIN users ON projects.userId = users.id
WHERE projects.deleted = true
AND users.active = true
如果要将另一个范围应用于默认范围，请将密钥传递defaultScope给.scope：

Project.scope('defaultScope', 'deleted').findAll();
SELECT * FROM projects WHERE active = true AND deleted = true
在调用多个作用域时，后续作用域中的键将覆盖以前的作用域（类似于Object.assign），除了where和include将被合并。考虑两个范围：

{
  scope1: {
    where: {
      firstName: 'bob',
      age: {
        [Op.gt]: 20
      }
    },
    limit: 2
  },
  scope2: {
    where: {
      age: {
        [Op.gt]: 30
      }
    },
    limit: 10
  }
}
调用.scope('scope1', 'scope2')将产生以下查询

WHERE firstName = 'bob' AND age > 30 LIMIT 10
注意如何limit与age被覆盖scope2，而firstName被保留。的limit，offset，order，paranoid，lock和raw字段被重写，而where被浅浅合并（这意味着相同的密钥将被覆盖）。合并策略include将在稍后讨论。

请注意，attributes多个应用范围的键以attributes.exclude始终保留的方式合并。这允许合并多个范围，并且永远不会泄漏最终范围内的敏感字段。

将查找对象直接传递findAll给作用域模型上的（和类似的查找程序）时，同样的合并逻辑适用：

Project.scope('deleted').findAll({
  where: {
    firstName: 'john'
  }
})
WHERE deleted = true AND firstName = 'john'
这里的deleted范围与finder合并。如果我们要传递where: { firstName: 'john', deleted: false }给finder，deleted范围将被覆盖。

### 合并包括
包含是根据包含的模型递归合并的。这是一个非常强大的合并，在v5上添加，并通过示例更好地理解。

考虑四种模型：Foo，Bar，Baz和Qux，具有如下多种关联：

class Foo extends Model {}
class Bar extends Model {}
class Baz extends Model {}
class Qux extends Model {}
Foo.init({ name: Sequelize.STRING }, { sequelize });
Bar.init({ name: Sequelize.STRING }, { sequelize });
Baz.init({ name: Sequelize.STRING }, { sequelize });
Qux.init({ name: Sequelize.STRING }, { sequelize });
Foo.hasMany(Bar, { foreignKey: 'fooId' });
Bar.hasMany(Baz, { foreignKey: 'barId' });
Baz.hasMany(Qux, { foreignKey: 'bazId' });
现在，考虑Foo上定义的以下四个范围：

{
  includeEverything: {
    include: {
      model: this.Bar,
      include: [{
        model: this.Baz,
        include: this.Qux
      }]
    }
  },
  limitedBars: {
    include: [{
      model: this.Bar,
      limit: 2
    }]
  },
  limitedBazs: {
    include: [{
      model: this.Bar,
      include: [{
        model: this.Baz,
        limit: 2
      }]
    }]
  },
  excludeBazName: {
    include: [{
      model: this.Bar,
      include: [{
        model: this.Baz,
        attributes: {
          exclude: ['name']
        }
      }]
    }]
  }
}
这四个范围可以很容易地深度合并，例如通过调用Foo.scope('includeEverything', 'limitedBars', 'limitedBazs', 'excludeBazName').findAll()，这完全等同于调用以下内容：

Foo.findAll({
  include: {
    model: this.Bar,
    limit: 2,
    include: [{
      model: this.Baz,
      limit: 2,
      attributes: {
        exclude: ['name']
      },
      include: this.Qux
    }]
  }
});
观察四个范围如何合并为一个。根据所包含的模型合并范围的包含。如果一个范围包括模型A而另一个范围包括模型B，则合并结果将包括模型A和B.另一方面，如果两个范围包括相同的模型A，但具有不同的选项（例如嵌套包含或其他属性） ，这些将以递归方式合并，如上所示。

无论应用于范围的顺序如何，上面说明的合并都以完全相同的方式工作。如果某个选项由两个不同的范围设置，那么该顺序只会产生差异 - 这不是上述示例的情况，因为每个范围都做了不同的事情。

这种合并策略也能在完全相同的方式与传递给选项.findAll，.findOne等等。

### 协会
Sequelize在关联方面有两个不同但相关的范围概念。差异很微妙但很重要：

关联范围允许您在获取和设置关联时指定默认属性 - 在实现多态关联时很有用。仅当使用和，以及关联的模型函数时get，才会在两个模型之间的关联上调用此范围setaddcreate
关联模型上的作用域允许您在获取关联时应用默认和其他作用域，并允许您在创建关联时传递作用域模型。这些范围既适用于模型上的常规查找，也适用于通过关联查找。
例如，考虑模型Post和Comment。注释与其他几个模型（图像，视频等）相关联，并且Comment和其他模型之间的关联是多态的，这意味着commentable除了外键之外，Comment还存储一列commentable_id。

可以使用关联范围实现多态关联：

this.Post.hasMany(this.Comment, {
  foreignKey: 'commentable_id',
  scope: {
    commentable: 'post'
  }
});
通话时post.getComments()，会自动添加WHERE commentable = 'post'。同样，在向帖子添加新评论时，commentable会自动设置为'post'。关联范围旨在生活在后台，而程序员不必担心它 - 它不能被禁用。有关更完整的多态示例，请参阅关联范围

那么考虑一下，Post有一个默认范围，只显示活动帖子：where: { active: true }。此范围存在于关联模型（Post）上，而不是commentable范围内的关联。就像在调用时应用默认范围一样Post.findAll()，它也会在调用时应用User.getPosts()- 这只会返回该用户的活动帖子。

要禁用默认范围，请传递scope: null给getter : User.getPosts({ scope: null }). 同样，如果要应用其他范围，请按照以下方式传递数组.scope：

User.getPosts({ scope: ['scope1', 'scope2']});
如果要为关联模型上的作用域创建快捷方法，可以将作用域模型传递给关联。考虑获取用户所有已删除帖子的快捷方式：

class Post extends Model {}
Post.init(attributes, {
  defaultScope: {
    where: {
      active: true
    }
  },
  scopes: {
    deleted: {
      where: {
        deleted: true
      }
    }
  },
  sequelize,
});

User.hasMany(Post); // regular getPosts association
User.hasMany(Post.scope('deleted'), { as: 'deletedPosts' });
User.getPosts(); // WHERE active = true
User.getDeletedPosts(); // WHERE deleted = true


## 原生查询
由于通常有一些用例可以更容易地执行原始/已准备好的SQL查询，因此您可以使用该功能sequelize.query。

默认情况下，该函数将返回两个参数 - 结果数组和包含元数据的对象（受影响的行等）。请注意，由于这是一个原始查询，因此元数据（属性名称等）是特定于方言的。某些方言在结果对象“内”返回元数据（作为数组上的属性）。但是，将始终返回两个参数，但对于MSSQL和MySQL，它将是对同一对象的两个引用。

sequelize.query("UPDATE users SET y = 42 WHERE x = 12").then(([results, metadata]) => {
  // Results will be an empty array and metadata will contain the number of affected rows.
})
如果您不需要访问元数据，则可以传递查询类型以告知续集如何格式化结果。例如，对于简单的选择查询，您可以执行以下操作：

sequelize.query("SELECT * FROM `users`", { type: sequelize.QueryTypes.SELECT})
  .then(users => {
    // We don't need spread here, since only the results will be returned for select queries
  })
还有其他几种查询类型。深入了解详情

第二种选择是模型。如果传递模型，则返回的数据将是该模型的实例。

// Callee is the model definition. This allows you to easily map a query to a predefined model
sequelize
  .query('SELECT * FROM projects', {
    model: Projects,
    mapToModel: true // pass true here if you have any mapped fields
  })
  .then(projects => {
    // Each record will now be an instance of Project
  })
查看查询API参考中的更多选项。以下是一些例子：

sequelize.query('SELECT 1', {
  // A function (or false) for logging your queries
  // Will get called for every SQL query that gets sent
  // to the server.
  logging: console.log,

  // If plain is true, then sequelize will only return the first
  // record of the result set. In case of false it will return all records.
  plain: false,

  // Set this to true if you don't have a model definition for your query.
  raw: false,

  // The type of query you are executing. The query type affects how results are formatted before they are passed back.
  type: Sequelize.QueryTypes.SELECT
})

// Note the second argument being null!
// Even if we declared a callee here, the raw: true would
// supersede and return a raw object.
sequelize
  .query('SELECT * FROM projects', { raw: true })
  .then(projects => {
    console.log(projects)
  })
“虚线”属性
如果表的属性名称包含点，则生成的对象将嵌套。这是因为在引擎盖下使用了dottie.js。见下文：

sequelize.query('select 1 as `foo.bar.baz`').then(rows => {
  console.log(JSON.stringify(rows))
})
[{
  "foo": {
    "bar": {
      "baz": 1
    }
  }
}]
更换
查询中的替换可以通过两种不同的方式完成，使用命名参数（以...开头:）或未命名，由a表示?。替换在选项对象中传递。

如果传递数组，?将按它们在数组中出现的顺序进行替换
如果传递了一个对象，:key则将替换该对象中的键。如果对象包含查询中未找到的键，反之亦然，则会引发异常。
sequelize.query('SELECT * FROM projects WHERE status = ?',
  { replacements: ['active'], type: sequelize.QueryTypes.SELECT }
).then(projects => {
  console.log(projects)
})

sequelize.query('SELECT * FROM projects WHERE status = :status ',
  { replacements: { status: 'active' }, type: sequelize.QueryTypes.SELECT }
).then(projects => {
  console.log(projects)
})
将自动处理数组替换，以下查询将搜索状态与值数组匹配的项目。

sequelize.query('SELECT * FROM projects WHERE status IN(:status) ',
  { replacements: { status: ['active', 'inactive'] }, type: sequelize.QueryTypes.SELECT }
).then(projects => {
  console.log(projects)
})
要使用通配符运算符％，请将其附加到替换项。以下查询匹配名称以“ben”开头的用户。

sequelize.query('SELECT * FROM users WHERE name LIKE :search_name ',
  { replacements: { search_name: 'ben%'  }, type: sequelize.QueryTypes.SELECT }
).then(projects => {
  console.log(projects)
})
绑定参数
绑定参数就像替换。除了替换在查询发送到数据库之前通过sequelize转义并插入查询，而绑定参数在SQL查询文本之外发送到数据库。查询可以具有绑定参数或替换。绑定参数由$ 1，$ 2，...（数字）或$ key（字母数字）引用。这与方言无关。

如果传递一个数组，$1则绑定到数组中的第一个元素（bind[0]）
如果传递了一个对象，$key则绑定到object['key']。每个键必须以非数字字符开头。$1即使object['1']存在，也不是有效密钥。
在任何一种情况下$$都可以用来逃避文字$符号。
数组或对象必须包含所有绑定值，否则Sequelize将抛出异常。这甚至适用于数据库可能忽略绑定参数的情况。

数据库可能会对此添加进一步的限制。绑定参数不能是SQL关键字，也不能是表或列名。在引用的文本或数据中也会忽略它们。在PostgreSQL中，如果无法从上下文中推断出类型，也可能需要对它们进行类型转换$1::varchar。

sequelize.query('SELECT *, "text with literal $$1 and literal $$status" as t FROM projects WHERE status = $1',
  { bind: ['active'], type: sequelize.QueryTypes.SELECT }
).then(projects => {
  console.log(projects)
})

sequelize.query('SELECT *, "text with literal $$1 and literal $$status" as t FROM projects WHERE status = $status',
  { bind: { status: 'active' }, type: sequelize.QueryTypes.SELECT }
).then(projects => {
  console.log(projects)
})


## 读复制（不同数据库间读写复制）
Sequelize支持读取复制，即当您想要进行SELECT查询时，可以连接多个服务器。当您执行读取复制时，您指定一个或多个服务器作为只读副本，并指定一个服务器作为写入主服务器，它处理所有写入和更新并将它们传播到副本（请注意，实际的复制过程不会被处理由Sequelize提供，但应由数据库后端设置）。

const sequelize = new Sequelize('database', null, null, {
  dialect: 'mysql',
  port: 3306
  replication: {
    read: [
      { host: '8.8.8.8', username: 'read-username', password: 'some-password' },
      { host: '9.9.9.9', username: 'another-username', password: null }
    ],
    write: { host: '1.1.1.1', username: 'write-username', password: 'any-password' }
  },
  pool: { // If you want to override the options used for the read/write pool you can do so here
    max: 20,
    idle: 30000
  },
})
如果您有适用于所有副本的任何常规设置，则无需为每个实例提供这些设置。在上面的代码中，数据库名称和端口将传播到所有副本。如果您将其留在任何副本中，则用户和密码也会发生相同的情况。每个副本有以下选项：host，port，username，password，database。

Sequelize使用池来管理与副本的连接。内部Sequelize将维护使用pool配置创建的两个池。

如果要修改这些，可以在实例化Sequelize时将池作为选项传递，如上所示。

每个write或useMaster: true查询将使用写池。对于SELECT读取池将被使用。使用基本循环调度切换只读副本。


## 迁移
就像使用Git / SVN管理源代码中的更改一样，您可以使用迁移来跟踪对数据库的更改。通过迁移，您可以将现有数据库转移到另一个状态，反之亦然：这些状态转换保存在迁移文件中，这些文件描述了如何进入新状态以及如何恢复更改以恢复到旧状态。

您将需要Sequelize CLI。CLI提供对迁移和项目引导的支持。

### CLI
安装CLI
让我们从安装CLI开始，您可以在此处找到说明。最喜欢的方式是像这样在本地安装
```js
$ npm install --save sequelize-cli
```
引导
要创建一个空项目，您需要执行init命令
```js
$ npx sequelize-cli init
```
这将创建以下文件夹

config，包含配置文件，告诉CLI如何连接数据库
models，包含项目的所有模型
migrations，包含所有迁移文件
seeders，包含所有种子文件
组态
在继续之前，我们需要告诉CLI如何连接到数据库。为此，让我们打开默认配置文件config/config.json。它看起来像这样

```js
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```
现在编辑此文件并设置正确的数据库参数和配置。

注意： 如果您的数据库尚不存在，则只需调用db:create命令即可。通过适当的访问，它将为您创建该数据库。
如果是 sqlite 则需要手动创建
```js
sqlite3 DatabaseName.db
```

创建第一个模型（和迁移）
正确配置CLI配置文件后，即可创建第一次迁移。它就像执行一个简单的命令一样简单。

我们将使用model:generate命令。此命令需要两个选项

name，模型的名称
attributes，模型属性列表
让我们创建一个名为的模型User。

$ npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
这将做以下

user在models文件夹中创建模型文件
创建名为迁移文件中像XXXXXXXXXXXXXX-create-user.js在migrations文件夹中
注意： Sequelize仅使用模型文件，它是表格表示。另一方面，迁移文件是该模型的更改，或者更具体地说是CLI使用的表。将提交或日志等迁移视为数据库中的某些更改。

运行迁移
在此步骤之前，我们尚未在数据库中插入任何内容。我们刚为第一个模型创建了所需的模型和迁移文件User。现在要在数据库中实际创建该表，您需要运行db:migrate命令。
0..
$ npx sequelize-cli db:migrate
此命令将执行以下步骤：

将确保SequelizeMeta在数据库中调用的表。此表用于记录在当前数据库上运行的迁移
开始查找尚未运行的任何迁移文件。这可以通过检查SequelizeMeta表来实现。在这种情况下，它将运行XXXXXXXXXXXXXX-create-user.js我们在上一步中创建的迁移。
创建一个Users使用其迁移文件中指定的所有列调用的表。
撤消迁移
现在我们的表已经创建并保存在数据库中。通过迁移，您只需运行命令即可恢复到旧状态。

您可以使用db:migrate:undo，此命令将还原最近的迁移。

$ npx sequelize-cli db:migrate:undo
您可以通过使用db:migrate:undo:all命令撤消所有迁移来恢复到初始状态。您还可以通过在--to选项中传递其名称来恢复到特定迁移。

$ npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js
创造第一粒种子
假设我们希望默认情况下将一些数据插入到几个表中。如果我们跟进前面的示例，我们可以考虑为User表创建一个演示用户。

要管理所有数据迁移，您可以使用播种机。种子文件是数据的一些变化，可用于使用样本数据或测试数据填充数据库表。

让我们创建一个种子文件，它将向我们的User表添加一个演示用户。

$ npx sequelize-cli seed:generate --name demo-user
此命令将在seeders文件夹中创建种子文件。文件名看起来像XXXXXXXXXXXXXX-demo-user.js。它遵循与up / down迁移文件相同的语义。

现在我们应该编辑这个文件以将demo用户插入到User表中。

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
        firstName: 'John',
        lastName: 'Doe',
        email: 'demo@demo.com'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
运行种子
在最后一步中，您已创建种子文件。它仍然没有致力于数据库。为此，我们需要运行一个简单的命令。

$ npx sequelize-cli db:seed:all
这将执行该种子文件，您将在User表中插入一个演示用户。

注意： 与使用该SequelizeMeta表的迁移不同，播种器执行不会存储在任何位置。如果您想覆盖此请阅读Storage部分

撤消种子
如果使用任何存储，播种机可以撤消。有两个可用的命令：

如果你想撤消最近的种子

$ npx sequelize-cli db:seed:undo
如果您想撤消特定的种子

$ npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data
如果你想撤消所有种子

$ npx sequelize-cli db:seed:undo:all
高级主题
迁移骨架
以下框架显示了典型的迁移文件。

module.exports = {
  up: (queryInterface, Sequelize) => {
    // logic for transforming into the new state
  },

  down: (queryInterface, Sequelize) => {
    // logic for reverting the changes
  }
}
传递的queryInterface对象可用于修改数据库。该Sequelize对象存储可用的数据类型，如STRING或INTEGER。功能up还是down应该返回一个Promise。我们来看一个例子：

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Person', {
        name: Sequelize.STRING,
        isBetaMember: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false
        }
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Person');
  }
}
以下是在数据库中执行两项更改的迁移示例，使用事务确保在发生故障时成功执行或回滚所有指令：

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('Person', 'petName', {
                    type: Sequelize.STRING
                }, { transaction: t }),
                queryInterface.addColumn('Person', 'favoriteColor', {
                    type: Sequelize.STRING,
                }, { transaction: t })
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('Person', 'petName', { transaction: t }),
                queryInterface.removeColumn('Person', 'favoriteColor', { transaction: t })
            ])
        })
    }
};
下一个是具有外键的迁移示例。您可以使用引用来指定外键：

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Person', {
      name: Sequelize.STRING,
      isBetaMember: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'schema'
          }
          key: 'id'
        },
        allowNull: false
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Person');
  }
}
该.sequelizerc文件
这是一个特殊的配置文件。它允许您指定通常作为参数传递给CLI的各种选项。您可以使用它的一些场景。

你不想使用默认的路径migrations，models，seeders或config文件夹。
你想重命名config.json为其他类似的东西database.json
还有更多。让我们看看如何使用此文件进行自定义配置。

首先，让我们在项目的根目录中创建一个空文件。

$ touch .sequelizerc
现在让我们使用示例配置。

const path = require('path');

module.exports = {
  'config': path.resolve('config', 'database.json'),
  'models-path': path.resolve('db', 'models'),
  'seeders-path': path.resolve('db', 'seeders'),
  'migrations-path': path.resolve('db', 'migrations')
}
使用此配置，您将告诉CLI

使用config/database.json文件进行配置设置
使用db/models的模型文件夹
使用db/seeders如播种机文件夹
使用db/migrations作为迁移文件夹
动态配置
配置文件默认是一个名为的JSON文件config.json。但有时您想要执行一些代码或访问JSON文件中不可能的环境变量。

Sequelize CLI可以读取文件JSON和JS文件。这可以用.sequelizerc文件设置。让我们看看如何

首先，您需要.sequelizerc在项目的根文件夹中创建一个文件。此文件应覆盖文件的配置路径JS。像这样

const path = require('path');

module.exports = {
  'config': path.resolve('config', 'config.js')
}
现在Sequelize CLI将加载config/config.js以获取配置选项。由于这是一个JS文件，您可以执行任何代码并导出最终的动态配置文件。

config/config.js文件的一个例子

const fs = require('fs');

module.exports = {
  development: {
    username: 'database_dev',
    password: 'database_dev',
    database: 'database_dev',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: 'database_test',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
      }
    }
  }
};
使用巴别塔
现在你知道如何使用.sequelizerc文件了。现在让我们看看如何使用此文件将babel与sequelize-clisetup 配合使用。这将允许您使用ES6 / ES7语法编写迁移和播种器。

首先安装 babel-register

$ npm i --save-dev babel-register
现在让我们创建.sequelizerc文件，它可以包含您可能想要更改的任何配置，sequelize-cli但除此之外，我们希望它为我们的代码库注册babel。像这样的东西

$ touch .sequelizerc # Create rc file
现在包括babel-register此文件中的设置

require("babel-register");

const path = require('path');

module.exports = {
  'config': path.resolve('config', 'config.json'),
  'models-path': path.resolve('models'),
  'seeders-path': path.resolve('seeders'),
  'migrations-path': path.resolve('migrations')
}
现在CLI将能够从迁移/播种器等运行ES6 / ES7代码。请记住这取决于您的配置.babelrc。请在babeljs.io上阅读更多相关信息。

使用环境变量
使用CLI，您可以直接访问内部的环境变量config/config.js。您可以使用它.sequelizerc来告诉CLI使用config/config.js配置。这在上一节中解释。

然后，您可以使用适当的环境变量公开文件。

module.exports = {
  development: {
    username: 'database_dev',
    password: 'database_dev',
    database: 'database_dev',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    dialect: 'mysql'
  }
};
指定方言选项
有时你想指定一个dialectOption，如果它是一般配置，你可以添加它config/config.json。有时你想执行一些代码来获取dialectOptions，你应该使用动态配置文件来处理这些情况。

{
    "production": {
        "dialect":"mysql",
        "dialectOptions": {
            "bigNumberStrings": true
        }
    }
}
生产用途
有关在生产环境中使用CLI和迁移设置的一些提示。

1）使用环境变量进行配置设置。使用动态配置可以更好地实现。示例生产安全配置可能看起来像。

const fs = require('fs');

module.exports = {
  development: {
    username: 'database_dev',
    password: 'database_dev',
    database: 'database_dev',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: 'database_test',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
      }
    }
  }
};
我们的目标是将环境变量用于各种数据库机密，而不是意外地将它们检入源代码控制。

存储
有三种类型的存储，您可以使用的：sequelize，json，和none。

sequelize ：在sequelize数据库的表中存储迁移和种子
json ：在json文件上存储迁移和种子
none ：不存储任何迁移/种子
迁移存储
默认情况下，CLI将在数据库中创建一个表，SequelizeMeta其中包含每个已执行迁移的条目。要更改此行为，可以将三个选项添加到配置文件中。使用时migrationStorage，您可以选择要用于迁移的存储类型。如果选择json，则可以指定文件的路径，migrationStoragePath 或者CLI将写入文件sequelize-meta.json。如果要将信息保留在数据库中，使用sequelize但希望使用其他表，则可以使用更改表名 migrationStorageTableName。您还可以SequelizeMeta通过提供migrationStorageTableSchema属性为表定义不同的架构。

{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql",

    // Use a different storage type. Default: sequelize
    "migrationStorage": "json",

    // Use a different file name. Default: sequelize-meta.json
    "migrationStoragePath": "sequelizeMeta.json",

    // Use a different table name. Default: SequelizeMeta
    "migrationStorageTableName": "sequelize_meta",

    // Use a different schema for the SequelizeMeta table
    "migrationStorageTableSchema": "custom_schema"
  }
}
注意： 不建议将none存储用作迁移存储。如果您决定使用它，请注意没有记录迁移执行或未运行的影响。

种子储存
默认情况下，CLI不会保存任何已执行的种子。如果选择更改此行为（！），则可以seederStorage在配置文件中使用更改存储类型。如果选择json，则可以指定文件的路径，seederStoragePath或者CLI将写入文件 sequelize-data.json。如果要将信息保存在数据库中，使用sequelize，可以使用指定表名seederStorageTableName，或者默认使用SequelizeData。

{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    // Use a different storage. Default: none
    "seederStorage": "json",
    // Use a different file name. Default: sequelize-data.json
    "seederStoragePath": "sequelizeData.json",
    // Use a different table name. Default: SequelizeData
    "seederStorageTableName": "sequelize_data"
  }
}
配置连接字符串
作为--config定义数据库的配置文件选项的替代方法，您可以使用该--url选项传入连接字符串。例如：

$ npx sequelize-cli db:migrate --url 'mysql://root:password@mysql_host.com/database_name'
传递方言特定选项
{
    "production": {
        "dialect":"postgres",
        "dialectOptions": {
            // dialect options like SSL etc here
        }
    }
}
程序化使用
Sequelize有一个姐妹库，用于以编程方式处理迁移任务的执行和记录。

查询接口
使用queryInterface之前描述的对象可以更改数据库架构。要查看它支持的完整公共方法列表，请检查QueryInterface API