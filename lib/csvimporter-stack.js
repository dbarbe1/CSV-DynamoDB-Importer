const { Stack, Duration } = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda');

class CsvimporterStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    
    const fn = new lambda.Function(this, 'csvimporter', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: new lambda.AssetCode('./src'),
    });
    
  }
}

module.exports = { CsvimporterStack }
