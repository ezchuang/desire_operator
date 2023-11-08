import dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config();

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION,
});


export default function sendToS3(file_name: string, file_path: string){
    const s3 = new AWS.S3();

    console.log("file_path: ", file_path);
    const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: file_name,
        Body: file_path,
        ContentType: 'image/jpeg',
    };
    return new Promise((resolve, reject) => {
        s3.upload(uploadParams, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location);
            }
        });
    });
}