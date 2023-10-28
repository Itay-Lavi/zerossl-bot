import { domain } from '../../config';
import ZeroSSLManager from '../../data/zeroSSLManager';

async function verifyDomain(id: string) {
  const zerossl = ZeroSSLManager.getZeroSSLInstance();
  console.log(`Verifing Domain: ${domain}`);
  await new Promise((resolve) => setTimeout(resolve, 3000)); //wait 3 seconds
  await zerossl.verifyDomains(id, { validation_method: 'HTTP_CSR_HASH' });

  console.log(`${domain} is verified!`);
}

export default verifyDomain;
