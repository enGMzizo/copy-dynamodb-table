const copyDynamodbTable = require('./index').copyDynamodbTable;

copyDynamodbTable({
  firstTableName : '',
  secondTableName :  '',
  },
  function(err,results){
    if(err) throw err;
    console.log(` √√`);
})