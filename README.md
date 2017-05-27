Safe Copy Dynamodb Table
===================

This module will allow you to copy data from one table to another using very simple API, Support cross zone copying and AWS config for each table ( source & destination )

## Installation

    npm i copy-dynamodb-table

## Usage :

```js
const copy = require('copy-dynamodb-table').copy

copy({
    source: {
      tableName: 'source_table_name', // required
    },
    destination: {
      tableName: 'destination_table_name', // required
    },
    log: true // default false
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

var globalAWSConfig = { // AWS Configration object http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
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
    log: true // default false
  },
  function (err, result) {
    if (err) {
      console.log(err)
    }
    console.log(result)
  })
```

## AWS Config for each table

```js
var copy = require('copy-dynamodb-table').copy

var globalAWSConfig = { // AWS Configration object http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
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
    log: true // default false
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
  - Increase Write capacity for your dynamodb table temporarily until the copying is finished so you can get the heights copying speed

## Use Case :
  With source table read capacity units = 100 & destination table write capacity units  = 1000 , I managed to copy ~100,000 items from source to destination within ~175 seconds , with avarage item size of 4 KB.

## Contributors :

- Ezzat [@enGMzizo](https://twitter.com/enGMzizo)

## License :

[ISC](https://spdx.org/licenses/ISC)
