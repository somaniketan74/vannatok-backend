import aws from "aws-sdk";
const ses = new aws.SES({
    region: process.env.SES_REGION,
    apiVersion: '2010-12-01'
});

//to: Array<string>, subject: string, htmlContent = "", text = ""
export const sendMail = async (to: Array<string>, text: string, subject: string) => {
    try {
        const params = getFormattedData(to, text, subject);
        let obj = ses.sendEmail(params).promise();
        let res = await obj;
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}

export const sendTemplateMail = async (to: Array<string>, data: any, template_name: string) => {
    try {
        const params = getTemplateFormattedData(to, data, template_name);
        let obj = ses.sendTemplatedEmail(params).promise();
        let res = await obj;
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}

const getFormattedData = (to: Array<string>, text: string, subject: string) => {
    let params = {
        Destination: {
            ToAddresses: to
        },
        Source: 'no-reply@vanna.io', 
        Message: { 
            Body: { 
                Text: {
                    Charset: "UTF-8",
                    Data: text
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
    };
    return params;
}

const getTemplateFormattedData = (to: Array<string>, data: any, template_name: string) => {
    let params = {
        Destination: {
            ToAddresses: to
        },
        Source: 'no-reply@vanna.io', 
        Template: template_name,
        TemplateData: JSON.stringify(data)
    };
    return params;
}