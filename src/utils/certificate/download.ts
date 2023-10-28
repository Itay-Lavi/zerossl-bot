import { Certificate, CertificateRecord } from 'zerossl/lib/types';
import ZeroSSLManager from '../../data/zeroSSLManager';
import { certificateName, domain, sslDirectory, sslValidationDirectory } from '../../config';
import { checkIfFileExists, saveTextToFile } from '../../data/localService';

export async function downloadCertificate(id: string) {
  const zerossl = ZeroSSLManager.getZeroSSLInstance();
  let certificate: Certificate | null = null;
  do {
    await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
    try {
      certificate = await zerossl.downloadCertificate(id);
    } catch (e) {
      console.log(e);
    }
  } while (!certificate);

  console.log('Certificate downloaded successfully!');

  const mergedCertificate = certificate[certificateName].concat(
    certificate['ca_bundle.crt']
  );

  saveTextToFile({
    data: mergedCertificate,
    fileDirectory: sslDirectory,
    fileName: certificateName,
  });
}

export async function downloadAuthFile(cert: CertificateRecord) {
  const domainValidation = cert.validation.other_methods[domain!];

  const fileContent: string[] = domainValidation.file_validation_content;
  let fileName: string;

  const url: string = domainValidation.file_validation_url_http;
  const lastSlashIndex = url.lastIndexOf('/');

  if (lastSlashIndex !== -1) {
    fileName = url.substring(lastSlashIndex + 1);
  } else {
    throw 'No match found. can not find file name in auth data';
  }

  const content = fileContent.join('\n');

  const authFileExist = checkIfFileExists({
    fileDirectory: sslValidationDirectory,
    fileName,
  });
  if (!authFileExist) {
    saveTextToFile({ data: content, fileDirectory: sslValidationDirectory, fileName });
  }

  return fileName;
}
