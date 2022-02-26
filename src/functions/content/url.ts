import { handlerWrapper } from '../../lib/utils/handlerWrapper';
import { LambdaLogic } from '../../lib/types/AWS';
import { HttpError } from '../../lib/utils';
import { awsConfig } from "../../lib/config/awsConfig";
import { uuid } from 'uuidv4';
import AWS from "aws-sdk";
import { getContentUploadUrlSchema } from "./validators";
AWS.config.update({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.content_bucket_region,
    signatureVersion: 'v4'
});
const s3 = new AWS.S3();
type url = {
    fileType: string,
    resource: string
}
const RESOURCE_TYPE:any = {
    "CONTENT-VIDEO": {
        "bucket": awsConfig.content_video_bucket,
        "allowed-type":["video/mp4"]
    },
    "CONTENT-IMAGE": {
        "bucket": awsConfig.content_image_bucket,
        "allowed-type":["jpg", "jpeg", "png", "tif", "tiff", "bmp",  "gif", "eps", "raw", "cr2", "nef"]
    },
    "DEFAULT": {
        "bucket": awsConfig.content_bucket
    }
}
const create: LambdaLogic<url> = async event => {
    const { fileType, resource = "DEFAULT" } = event.queryStringParameters;
    if(RESOURCE_TYPE.hasOwnProperty(resource) && RESOURCE_TYPE[resource]["allowed-type"] && RESOURCE_TYPE[resource]["allowed-type"].indexOf(fileType) == -1){
        throw new HttpError().BadRequest("Invalid resource type");
    }
    const identifier = uuid();
    let uploadUrl = "";
    let res_url = "";
    switch(resource){
        case "CONTENT-VIDEO":
            uploadUrl = s3.getSignedUrl('putObject', { "Bucket": RESOURCE_TYPE[resource]["bucket"], "Key": identifier, "ContentType": fileType });
            res_url = `${awsConfig.content_video_cdn_url}${identifier}.m3u8`
            break;
        case "CONTENT-IMAGE":
            uploadUrl = s3.getSignedUrl('putObject', { "Bucket": RESOURCE_TYPE[resource]["bucket"], "Key": identifier, "ContentType": fileType, "ACL": 'public-read' });
            res_url = `${awsConfig.content_cdn_url}${identifier}`
            break;
        default:
            uploadUrl = s3.getSignedUrl('putObject', { "Bucket": RESOURCE_TYPE[resource]["bucket"], "Key": identifier, "ContentType": fileType, "ACL": 'public-read' });
            res_url = `${awsConfig.content_cdn_url}${identifier}`
            break;
    }
    return { uploadUrl, url: res_url};
}

export const getContentUploadUrl = handlerWrapper(create, getContentUploadUrlSchema);