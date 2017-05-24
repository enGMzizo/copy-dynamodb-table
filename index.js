const async = require('async')
const AWS = require('aws-sdk')

let counter = 0
const dynamoClient = new AWS.DynamoDB.DocumentClient()
let retries = 0

module.exports.copyDynamodbTable = function copyDynamodbTable( {firstTableName , secondTableName ,LastEvaluatedKey}, cb){
  async.waterfall([function(fn){
    getItems({tableName : firstTableName , LastEvaluatedKey : LastEvaluatedKey },fn)
  },
  function(data,fn){
    putItems(secondTableName,data,fn)
  }],function(err,data){
    if(err){
      throw err
    }

    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(`Finished ${counter} items`)

    if(data.LastEvaluatedKey === undefined){
      return cb(err,'Finished All Items')
    }

    copyDynamodbTable({firstTableName , secondTableName ,LastEvaluatedKey:data.LastEvaluatedKey},cb)
  })
}

function getItems(scanItems,fn){
  scan(scanItems,function(err,data){
    if(err) throw err
    fn(err,mapItems(data))
  })
}


function scan({tableName,LastEvaluatedKey},fn){
  dynamoClient.scan({
    TableName: tableName,
    Limit : 25,
    ExclusiveStartKey : LastEvaluatedKey
  },function(err,data){
    fn(err,data)
  })
}

function mapItems(data){
  data.Items = data.Items.map(function(item){
    return { PutRequest: {Item: item}}
  })
  return data
}

function putItems(tableName,data,fn){
  let batchWrite = {}
  batchWrite['RequestItems'] = {}
  batchWrite['RequestItems'][tableName] = data.Items
  dynamoClient.batchWrite(batchWrite,function(err,{UnprocessedItems}){
    if(err) console.trace(err)
    let UnprocessedItemsLength = 0
    if(UnprocessedItems[tableName] !== undefined){
      UnprocessedItemsLength = UnprocessedItems[tableName].length;
      setTimeout(function(){
        putItems(tableName,{
          Items : UnprocessedItems[tableName],
          LastEvaluatedKey : data.LastEvaluatedKey
        },fn)
      }, 2 * retries * 100 ) // from aws http://docs.aws.amazon.com/general/latest/gr/api-retries.html
      retries++
      counter += (data.Items.length - UnprocessedItemsLength)
      return ;
    }
    retries = 0
    counter += data.Items.length
    fn(err,data)
  })
}