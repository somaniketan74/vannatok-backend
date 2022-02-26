export const awsConfig = {
    accessKeyId: process.env.BUCKET_ACCESS_KEY_ID,
    secretAccessKey: process.env.BUCKET_ACCESS_SECRET,
    content_bucket_region: process.env.CONTENT_BUCKET_REGION,
    content_bucket: process.env.CONTENT_BUCKET,
    content_cdn_url: process.env.CONTENT_CDN_URL,
    content_video_bucket: process.env.CONTENT_VIDEO_BUCKET,
    content_video_cdn_url: process.env.CONTENT_VIDEO_CDN_URL,
    content_image_bucket: process.env.CONTENT_IMAGE_BUCKET
};