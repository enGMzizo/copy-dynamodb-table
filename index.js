'use strict'
var AWS = require('aws-sdk')
var validate = require('./validate')

module.exports.copy = function copy(values, fn) {

  try {
    validate.config(values)
  } catch (err) {
    if (err) {
      return fn(err, {
        count: 0,
        status: 'FAIL'
      })
    }
  }

  var options = {
    config: values.config,
    source: {
      tableName: values.source.tableName,
      dynamoClient: values.source.dynamoClient || new AWS.DynamoDB.DocumentClient(values.source.config || values.config),
    },
    destination: {
      tableName: values.destination.tableName,
      dynamoClient: values.destination.dynamoClient || new AWS.DynamoDB.DocumentClient(values.destination.config || values.config),
    },
    key: values.key,
    counter: values.counter || 0,
    retries: 0,
    data: {},
    log: values.log
  }

  getItems(options, function (err, data) {
    options.data = data
    options.key = data.LastEvaluatedKey
    putItems(options, function (err) {
      if (err) {
        throw err
      }

      if (options.log) {
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write('Finished ' + options.counter + ' items')
      }

      if (options.key === undefined) {
        return fn(err, {
          count: options.counter,
          status: 'SUCCESS'
        })
      }
      copy(options, fn)
    })
  })
}

function getItems(options, fn) {
  scan(options, function (err, data) {
    if (err) {
      throw err
    }
    fn(err, mapItems(data))
  })
}


function scan(options, fn) {
  options.source.dynamoClient.scan({
    TableName: options.source.tableName,
    Limit: 25,
    ExclusiveStartKey: options.key
  }, fn)
}

function mapItems(data) {
  data.Items = data.Items.map(function (item) {
    return {
      PutRequest: {
        Item: item
      }
    }
  })
  return data
}

function putItems(options, fn) {
  var batchWriteItems = {}
  batchWriteItems.RequestItems = {}
  batchWriteItems.RequestItems[options.destination.tableName] = options.data.Items
  options.destination.dynamoClient.batchWrite(batchWriteItems, function (err, data) {
    if (err) {
      throw err
    }
    var unprocessedItems = data.UnprocessedItems[options.destination.tableName]
    if (unprocessedItems !== undefined) {

      options.retries++
        options.counter += (options.data.Items.length - unprocessedItems.length)

      options.data = {
        Items: unprocessedItems
      }
      return setTimeout(function () {
        putItems(options, fn)
      }, 2 * options.retries * 100) // from aws http://docs.aws.amazon.com/general/latest/gr/api-retries.html

    }
    options.retries = 0
    options.counter += options.data.Items.length
    fn(err, options)
  })
}