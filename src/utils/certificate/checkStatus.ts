import { CertificateRecord } from 'zerossl/lib/types';
import { checkIfFileExist } from '../../data/localService';
import ZeroSSLManager from '../../data/zeroSSLManager';

async function checkStatus() {
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
    throw `There is an active certificate:\n${issuedCertificate.common_name}`;
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
    checkIfFileExist({ fileDirectory: 'ssl\\', fileName: 'private.key' }) &&
    checkIfFileExist({ fileDirectory: 'ssl\\', fileName: 'certificate.crt' })
  );
}

export default checkStatus;
