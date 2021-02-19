var copy = require('./index').copy

var globalAWSConfig = { // AWS Configuration object http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  accessKeyId: 'AKID',
  secretAccessKey: 'SECRET',
  region: 'eu-west-1'
}

var sourceAWSConfig = {
  accessKeyId: 'AKID',
  secretAccessKey: 'SECRET',
  region: 'eu-west-1'
}

var destinationAWSConfig = {
  accessKeyId: 'AKID',
  secretAccessKey: 'SECRET',
  region: 'us-west-2' // support cross zone copying
}

copy({
  config: globalAWSConfig,
  source: {
    tableName: 'source_table_name', // required
    config: sourceAWSConfig // optional , leave blank to use globalAWSConfig
  },
  destination: {
    tableName: 'destination_table_name', // required
    config: destinationAWSConfig // optional , leave blank to use globalAWSConfig
  },
  log: true, // default false
  create: false, // create table if not exist
  schemaOnly: false, // make it true and it will copy schema only
  continuousBackups: true, // default 'copy', true will always enable backups, 'copy' copies the behaviour from the source and false does not enable them
  transformDataFn: function(item){ return item } // function to transform data
},
  function (err, result) {
    if (err) {
      console.log(err)
    }
    console.log(result)
  })