const path = require("path");
const OSS = require('ali-oss');

const putOSS = async(region,accessKeyId,accessKeySecret,bucket,object,localFile) =>{
    let client = new OSS({
        region: region,
        accessKeyId: accessKeyId,// 阿里云获取
        accessKeySecret: accessKeySecret, // 阿里云获取
        bucket: bucket // 阿里云获取
    });
    try {
        // 'object'填写上传至OSS的object名称,即不包括Bucket名称在内的Object的完整路径。
        // 'localfile'填写上传至OSS的本地文件完整路径。
        let r1 = await client.put(object,localFile);
        console.log('put success: %j', r1);
        let r2 = await client.get(object);
        console.log('get success: %j', r2);
    } catch(e) {
        console.log('error: %j', e);
    }
}

const run = async (job, settings, action, type) => {
    if (type != "postrender") {
        throw new Error(
            `[nexrender-action-upload-s3-presigned] action can be only run in postrender mode, you provided: ${type}.`
        );
    }
    const {logger} = settings;
    const {
        input,
        params: { region,accessKeyId,accessKeySecret,bucket,object },
    } = action;
    try {
        let finalInput = input ?? job.output;
        if (!path.isAbsolute(finalInput))
            finalInput = path.join(job.workpath, finalInput);

        logger.log(
            `[aeworker-oss] uploading to presigned-url: ${url}`
        );

        await putOSS(region,accessKeyId,accessKeySecret,bucket,object,finalInput, logger);
    } catch (error) {
        logger.log(
            `[aeworker-oss] failed uploading to presigned-url: ${url} \n ${error?.message}`
        );
        throw error;
    }
};

module.exports = run;