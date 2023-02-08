const AWS = require('aws-sdk');
const csv =require('csvtojson')
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();


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
async function dynamoDBPut(csvitem,tablename) {
  var dynamodbparams = {
    TableName: tablename
  };
  //initialize DynamoDB row parameters with CSV row data, tablename initalized in function handler
  dynamodbparams.Item = csvitem;
  //console.log(dynamodbparams);
  try{
    await dynamodb.put(dynamodbparams).promise();
    return csvitem;
  }catch(error){
    console.log("FAIL: ", csvitem);
    throw new Error();
  }
}


exports.handler = async function(event, context) {
  
    let successfulinserts = 0;
    let failedinserts = 0;
    
    //Find file in S3 based on event parameters
    let csvbody = await S3GetObject(event.bucket,event.key);
    //console.log(csvbody);

    let rowpromises = [];
    //Convert CSV File into Json Object
    await csv().fromString(csvbody).subscribe((json)=>{
       rowpromises.push(dynamoDBPut(json,event.tablename));
    });
    
    Promise.allSettled(rowpromises)
      .then((result) => {
        result.forEach(element => {
          if(element.status == 'fulfilled'){
            console.log("SUCCESS");
            successfulinserts++;
          }else{
            failedinserts++;
          }
        });
        console.log(successfulinserts," Successful Inserts");
        console.log(failedinserts," Failed Inserts");
      });
        
        
    let response = {
        statusCode: 200,
        body: "CSV Uploaded.",
    };
    return response;
};