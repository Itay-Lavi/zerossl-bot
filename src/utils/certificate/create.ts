import { domain, email } from '../../config';
import { saveTextToFile } from '../../data/localService';
import ZeroSSLManager from '../../data/zeroSSLManager';

async function createCertificate() {
  const zerossl = ZeroSSLManager.getZeroSSLInstance();

  const keyPair = zerossl.generateKeyPair();
  const csrOptions = {
    country: 'IL',
    state: 'ISRAEL',
    locality: 'HaMerkaz',
    organization: '',
    organizationUnit: '',
    email: email,
    commonName: domain,
  };
  const csr = zerossl.generateCSR(keyPair, csrOptions);

  console.log('Creating certificate');
  const certificate = await zerossl.createCertificate({
    csr: csr,
    domains: [domain],
    validityDays: 90,
    strictDomains: true,
  });

  await new Promise((resolve) => setTimeout(resolve, 2000)); //wait 2 seconds
  const newCertificate = await zerossl.getCertificate(certificate.id);
  if (newCertificate) {
    console.log('Created certificate');
  } else {
    throw 'Failed to create certificate.';
  }

  saveTextToFile({
    data: keyPair.privateKey,
    fileDirectory: 'ssl\\',
    fileName: 'private.key',
  });

  return newCertificate;
}

export default createCertificate;
