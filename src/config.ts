import * as os from 'os';

export const accessKey = process.env.ZEROSSL_ACCESS_KEY;
export const domain = process.env.DOMAIN;
export const email = process.env.EMAIL;

export const sslDirectory = 'ssl';
export const sslValidationDirectory = 'ssl-validation';

export const dhparamName = 'dhparam.pem';
export const privateKey = 'private.key';
export const certificateName = 'certificate.crt';

export const homeDirectory: string = os.homedir();