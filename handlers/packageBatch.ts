import { S3 } from "aws-sdk";
import { Handler } from "aws-lambda";

interface Sweets {
  shape: string;
  name: string;
  quantity: number;
}

interface QualityCheckOutput {
  statusCode: number;
  body: {
    status: string;
    batchId: string;
    shapedSweets: Sweets[];
  };
  checkShape?: {
    validShapes: boolean;
  };
  apiQualityCheck?: {
    validApiQualityCheck: boolean;
  };
}

interface PackagingRecord {
  batchId: string;
  shapedSweets: Sweets[];
  packagingTimestamp: string;
}

const s3 = new S3();

export const handler: Handler = async (event: QualityCheckOutput[]) => {
    const {body: {batchId, shapedSweets}} = event[0];

    const packagingRecord: PackagingRecord = {
        batchId,
        shapedSweets,
        packagingTimestamp: new Date().toISOString()
    }

    const packagingRecordJson = JSON.stringify(packagingRecord);

    const params = {
        Bucket: process.env.PACKAGING_BUCKET,
        Key: `${batchId}.json`,
        Body: packagingRecordJson
    }

    await s3.putObject(params).promise();

    return packagingRecord




}