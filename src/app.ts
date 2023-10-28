import { CertificateRecord } from 'zerossl/lib/types';
import checkStatus from './utils/certificate/checkStatus';
import createCertificate from './utils/certificate/create';
import verifyCertificate from './utils/certificate/verifyDomain';
import validateENV from './utils/validateENV';
import {
  downloadAuthFile,
  downloadCertificate,
} from './utils/certificate/download';

async function main() {
  try {
    validateENV();
    const checkResult = await checkStatus();
    let certificate: CertificateRecord;

    if (!checkResult || checkResult.createNew) {
      certificate = await createCertificate();
    } else {
      certificate = checkResult.certificate;
    }

    await downloadAuthFile(certificate);
    await verifyCertificate(certificate.id);
    await downloadCertificate(certificate.id);

    console.log('Certificate process completed successfully.');
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
}

main();