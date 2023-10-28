import { CertificateRecord } from 'zerossl/lib/types';
import { checkIfFileExists } from '../../data/localService';
import ZeroSSLManager from '../../data/zeroSSLManager';
import {
  certificateName,
  dhparamName,
  privateKey,
  sslDirectory,
} from '../../config';

async function checkStatus() {
  await waitForDhparam();

  const zerossl = ZeroSSLManager.getZeroSSLInstance();
  const domain = process.env.DOMAIN;
  const certificates = await zerossl.listCertificates({ search: domain });

  const issuedCertificate = certificates.results.find(
    (cert) => cert.status === 'issued'
  );
  const expiringSoonCertificate = certificates.results.find(
    (cert) => cert.status === 'expiring_soon'
  );
  const draftCertificate = certificates.results.find((cert) =>
    ['draft', 'pending_validation'].includes(cert.status)
  );

  if (issuedCertificate) {
    return handleIssuedCertificate(issuedCertificate);
  } else if (expiringSoonCertificate) {
    return handleExpiringSoonCertificate(expiringSoonCertificate);
  } else if (draftCertificate) {
    return handleDraftCertificate(draftCertificate);
  } else {
    return handleExpiredOrCanceledCertificate();
  }
}

function handleIssuedCertificate(issuedCertificate: CertificateRecord) {
  if (checkIfCertsDownloaded()) {
    console.log(
      `There is an active certificate:\n${issuedCertificate.common_name}`
    );
    process.exit(0);
  } else {
    console.log(`There is an active certificate, but not downloaded!`);
    return { createNew: false, certificate: issuedCertificate };
  }
}

function handleExpiringSoonCertificate(
  expiringSoonCertificate: CertificateRecord
) {
  console.log('Certificate expiring soon!');
  return { createNew: true, certificate: expiringSoonCertificate };
}

function handleDraftCertificate(draftCertificate: CertificateRecord) {
  console.log('Certificate status is draft or pending_validation');
  return { createNew: false, certificate: draftCertificate };
}

function handleExpiredOrCanceledCertificate() {
  console.log(
    'Certificate status is expired or canceled, creating a new certificate'
  );
  return undefined;
}

function checkIfCertsDownloaded() {
  return (
    checkIfFileExists({
      fileDirectory: sslDirectory,
      fileName: privateKey,
    }) &&
    checkIfFileExists({
      fileDirectory: sslDirectory,
      fileName: certificateName,
    })
  );
}

async function waitForDhparam() {
  if (
    checkIfFileExists({
      fileDirectory: sslDirectory,
      fileName: dhparamName,
    })
  ) {
    return;
  }

  console.log('Waiting for ' + dhparamName);
  let fileExists: boolean = false;
  do {
    fileExists = checkIfFileExists({
      fileDirectory: sslDirectory,
      fileName: dhparamName,
    });
    await new Promise((resolve) => setTimeout(resolve, 1 * 60 * 1000));
  } while (!fileExists);
}

export default checkStatus;
