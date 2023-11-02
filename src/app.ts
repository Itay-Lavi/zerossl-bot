import * as path from 'path';
import { CertificateRecord } from 'zerossl/lib/types';
import checkStatus from './certificate/checkStatus';
import createCertificate from './certificate/create';
import verifyCertificate from './certificate/verifyDomain';
import validateENV from './utils/validateENV';
import { downloadAuthFile, downloadCertificate } from './certificate/download';
import {
  botService,
  homeDirectory,
  mainServiceName,
  sslValidationDirectory,
} from './config';
import { clearValidationFolder } from './data/localService';
import { restartPodsByLabelSelector } from './kubernetes/managePods';

import { getService, replaceServices, stringToService } from './kubernetes/manageServices';
import { closeServer, runServer } from './certificate/server';



async function main() {
  try {
    // Validate environment variables
    validateENV();

    // Check the status and get the certificate information
    const checkResult = await checkStatus();
    let certificate: CertificateRecord;

    // Create a new certificate if it doesn't exist or needs to be recreated
    if (!checkResult || checkResult.createNew) {
      certificate = await createCertificate();
    } else {
      certificate = checkResult.certificate;
    }

    // Download authentication file using the certificate
    const authFileName = await downloadAuthFile(certificate);

    // Get main service and bot service objects
    const mainServiceObject = await getService(mainServiceName!);
    const botServiceObject = stringToService(botService!);

    // Replace main service with bot service and start server
    await replaceServices({ deleteServiceObject: mainServiceObject, addServiceObject: botServiceObject });
    const server = runServer(authFileName);

    // Verify and download the certificate
    await verifyCertificate(certificate.id);
    await downloadCertificate(certificate.id);
    await closeServer(server);

    // Replace bot service with main service and restart pods
    await replaceServices({ deleteServiceObject: botServiceObject, addServiceObject: mainServiceObject });
    await restartPodsByLabelSelector();

    // Clear SSL validation folder and print success message
    clearValidationFolder(path.join(homeDirectory, sslValidationDirectory));
    console.log('Certificate process completed successfully.');
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
  
  // Exit the process with success code
  process.exit(0);
}


main();

