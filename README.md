Safe Copy Dynamodb Table
===================

This module will allow you to copy data from one table to another using very simple API


#### Installation

    $ npm install safe-copy-dynamodb-table

#### Uage :


    const copyDynamodbTable = require('./index').copyDynamodbTable;
    copyDynamodbTable({
      firstTableName : '<source table name>',
      secondTableName :  '<destination table name>',
      },
      function(err,results){
        if(err) throw err;
        console.log(` √√`);
    })

#### To do :

> - Support cross zone coping
> - Support explicit AWS config for each table source & destination

#### Contributors :

> - Ezzat [@enGMzizo](https://twitter.com/enGMzizo)

#### License :

MIT
