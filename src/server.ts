import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { homeDirectory, sslValidationDirectory } from './config';

function runServer(fileName: string) {
  const server: http.Server = http.createServer(
    (req: http.IncomingMessage, res: http.ServerResponse) => {
      const filePath: string = path.join(homeDirectory, sslValidationDirectory, fileName);

      try {
        fs.accessSync(filePath, fs.constants.R_OK);

        const data: Buffer = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);

        const ipAddress: string = req.socket.remoteAddress || '';
        console.log(`Auth file served to ${ipAddress}`);
      } catch (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File Not Found');
      }
    }
  );

  server.listen(80, () => {
    console.log(`Server is running`);
  });
}

export default runServer;
