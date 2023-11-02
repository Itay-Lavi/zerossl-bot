import * as path from 'path';
import { CertificateRecord } from 'zerossl/lib/types';
import checkStatus from './certificate/checkStatus';
import createCertificate from './certificate/create';
import verifyCertificate from './certificate/verifyDomain';
import validateENV from './utils/validateENV';
import {
  downloadAuthFile,
  downloadCertificate,
} from './certificate/download';
import { homeDirectory, sslValidationDirectory } from './config';
import { clearValidationFolder } from './data/localService';
import { restartPodByLabelSelector } from './kubernetes/managePods';

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
    await restartPodByLabelSelector();

    const sslValidationFolderPath: string = path.join(homeDirectory, sslValidationDirectory);
    clearValidationFolder(sslValidationFolderPath);
    console.log('Certificate process completed successfully.');
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
  process.exit(0);
}

main();
