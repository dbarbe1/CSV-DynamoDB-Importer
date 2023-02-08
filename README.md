# CSV to DynamoDB Importer

CSV to DynamoDB Importer built using NodeJS/Lambda, and deployed to AWS via AWS CDK. 

To use the importer: 
-upload your CSV file to S3 (Be sure your database indexes are included and in the correct order)
-Run the Lambda function with a payload including the bucket and key for the CSV file to parse, along with the DynamoDB database name.
-Failed Imports are formatted as JSON and logged

Exmaple Event payload:

{
  "bucket": "CSVBucket",
  "key": "CSVKey.csv",
  "tablename": "DynamoDBTableName"
}


The `cdk.json` file tells the CDK Toolkit how to execute your app. The build step is not required when using JavaScript.



## Useful commands

* `cdk deploy`           deploy this stack to your default AWS account/region
* `cdk diff`             compare deployed stack with current state
* `cdk synth`            emits the synthesized CloudFormation template
