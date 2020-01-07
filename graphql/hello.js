var { graphql, buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String,
    name: String,
    value: String
  }
`);

var root = { 
  hello: () => 'Hello world!',
  name: "test",
  value:()=> new Promise((resolve,reject)=>setTimeout(()=>resolve("test"),1000))
};

graphql(schema, '{ hello,name,value }', root).then((response) => {
  console.log(response);
});