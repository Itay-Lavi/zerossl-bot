import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const homeDirectory: string = `${os.homedir()}\\`;

export function saveTextToFile({
  data,
  fileDirectory,
  fileName,
}: {
  data: string;
  fileDirectory: string;
  fileName: string;
}) {
  const filePath: string = path.join(homeDirectory,fileDirectory, fileName);
  
  const fileAbsoluteDir = path.join(homeDirectory,fileDirectory);
  try {
    if (!fs.existsSync(fileAbsoluteDir)) {
      fs.mkdirSync(fileAbsoluteDir, { recursive: true });
    }

    fs.writeFileSync(filePath, data);
    console.log(fileName + ' has been written successfully.');
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
}

export function checkIfFileExist({
  fileDirectory,
  fileName,
}: {
  fileDirectory: string;
  fileName: string;
}): boolean {
  const filePath: string = path.join(homeDirectory, fileDirectory, fileName);

  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    console.log(fileName + ' exist');
    return true;
  } catch (err) {
    console.log(fileName + ' not exist');
    return false;
  }
}
