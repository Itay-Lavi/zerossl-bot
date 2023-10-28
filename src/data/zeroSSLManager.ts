import { ZeroSSL } from 'zerossl';
import { accessKey } from '../config';

class ZeroSSLManager {
  private static zerossl: ZeroSSL;

  private constructor() {
    ZeroSSLManager.zerossl = new ZeroSSL({ accessKey } as {accessKey: string});
  }

  public static getZeroSSLInstance(): ZeroSSL {
    if (!ZeroSSLManager.zerossl) {
      new ZeroSSLManager();
    }
    return ZeroSSLManager.zerossl;
  }
}

export default ZeroSSLManager;
