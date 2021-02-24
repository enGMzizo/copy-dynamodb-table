Safe Copy Dynamodb Table
===================

This module will allow you to copy data from one table to another using very simple API, Support cross zone copying and AWS config for each table ( source & destination ) and it can create the destination table using source table schema

[![Dependencies](https://david-dm.org/enGMzizo/copy-dynamodb-table.png)](https://david-dm.org/enGMzizo/copy-dynamodb-table) [![NPM version](https://badge.fury.io/js/copy-dynamodb-table.png)](http://badge.fury.io/js/copy-dynamodb-table)


## Installation

    npm i copy-dynamodb-table

## Usage :

```js
var copy = require('copy-dynamodb-table').copy

copy({
    source: {
      tableName: 'source_table_name', // required
    },
    destination: {
      tableName: 'destination_table_name', // required
    },
    log: true, // default false
    create : true, // create destination table if not exist
    schemaOnly : false, // if true it will copy schema only -- optional
    continuousBackups: true, // if true will enable point in time backups
    transform: function(item , index){ return item } // function to transform data
  },
  function (err, result) {
    if (err) {
      console.log(err)
    }
    console.log(result)
  })
```
## Adding AWS Config :

```js
var copy = require('copy-dynamodb-table').copy

var globalAWSConfig = { // AWS Configuration object http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  accessKeyId: 'AKID',
  secretAccessKey: 'SECRET',
  region: 'eu-west-1'
}

copy({
    config: globalAWSConfig, // config for AWS
    source: {
      tableName: 'source_table_name', // required
    },
    destination: {
      tableName: 'destination_table_name', // required
    },
    log: true, // default false
    create : true, // create destination table if not exist
    continuousBackups: 'copy' // if 'copy' it will match the point in time backups from the source
  },
  function (err, result) {
    if (err) {
      console.log(err)
    }
    console.log(result)
  })
```

## AWS Config for each table ( cross region ) :

```js
var copy = require('copy-dynamodb-table').copy

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
    log: true,// default false
    create : true // create destination table if not exist
  },
  function (err, result) {
    if (err) {
      console.log(err)
    }
    console.log(result)
  })
```

## Note :

  - If `source.config` or `destination.config` value is `undefined` , the module will use the `globalAWSConfig`.
  - If `globalAWSConfig` value is `undefined` the module will extact `AWS` config from environment variables.
  - Increase Write capacity for your dynamodb table temporarily until the copying is finished so you can get the highest copying speed

## Promise version :

Use this if you want to copy using promises, or async / await .

```javascript
function promiseCopy(data) {
  return new Promise((resolve, reject) => {
    copy(data, function (err, result) {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

promiseCopy({
  source: {
    tableName: 'source_table_name', // required
  },
  destination: {
    tableName: 'destination_table_name', // required
  },
  log: true, // default false
  create: true // create destination table if not exist
}).then(function (results) {
  // do stuff
}).catch(function (err) {
  //handle error
})
```

## Use Case :
  With source table read capacity units = 100 & destination table write capacity units  = 1000 , I managed to copy ~100,000 items from source to destination within ~175 seconds , with avarage item size of 4 KB.

## Contributors :

- [@enGMzizo](https://twitter.com/enGMzizo)
- [jazarja](https://github.com/jazarja)
- [kevpmoore](https://github.com/kevpmoore)
- [Floby](https://github.com/Floby)
- [jermeo](https://github.com/jermeo)
- [Simon Li](https://github.com/siutsin)
- [Janusz Slota](https://github.com/nixilla)
- [Kyle Watson](https://github.com/kylejwatson)

## License :

[ISC](https://spdx.org/licenses/ISC)
