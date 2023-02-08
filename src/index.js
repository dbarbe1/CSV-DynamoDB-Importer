const AWS = require('aws-sdk');
const csv =require('csvtojson')
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();

//initialize dynamodb put object
var dynamodbparams = {};
var failedinserts = [];
var successfulinserts = 0;

//S3 getobject function
async function S3GetObject(bucket,key) {
  //initialize S3 getObject parameters, bucket and key(path/filename.ext)
  const params = {
    Bucket: bucket,
    Key: key
  };
  console.log(params);
  const response = await s3.getObject(params).promise();
  //console.log(response);
  return response.Body.toString(); //stringify file contents
}

//DynamoDB Put Item function
async function dynamoDBPut(csvitem) {
  //initialize DynamoDB row parameters with CSV row data, tablename initalized in function handler
  dynamodbparams.Item = csvitem;
  //console.log(dynamodbparams);
  try{
    await dynamodb.put(dynamodbparams).promise();
    console.log("SUCCESS: ",dynamodbparams.Item);
    successfulinserts++;
  }catch(error){
    console.log("FAILED: ",dynamodbparams.Item);
    failedinserts[failedinserts.length] = dynamodbparams.Item; //Insert failed insert requets to an array to report at end of function
  }
}


exports.handler = async function(event, context) {
    
    dynamodbparams.TableName = event.tablename;
    //Find file in S3 based on event parameters
    let csvbody = await S3GetObject(event.bucket,event.key);
    //console.log(csvbody);


    //Convert CSV File into Json Object
    let jsonfilecontent = await csv().fromString(csvbody).subscribe();
    //console.log("JSON File Content: ",jsonfilecontent[0]);

    for (let i = 0; i < jsonfilecontent.length; i++) {
      await dynamoDBPut(jsonfilecontent[i]);
    }
    
    console.log("FAILED INSERTS: ",failedinserts); //log 
    const response = {
        statusCode: 200,
        body: successfulinserts +" Successful Inserts. " + (failedinserts.length) + " Failed Inserts.",
    };
    return response;
};