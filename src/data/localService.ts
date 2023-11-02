import * as fs from 'fs';

import * as path from 'path';
import { homeDirectory } from '../config';

export function saveTextToFile({
  data,
  fileDirectory,
  fileName,
}: {
  data: string;
  fileDirectory: string;
  fileName: string;
}) {
  const filePath: string = path.join(homeDirectory, fileDirectory, fileName);

  const fileAbsoluteDir = path.join(homeDirectory, fileDirectory);
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

export function readTextFromFile(absolutePath: string) {
  if (!fs.existsSync(absolutePath)) {
    throw new Error('File does not exist');
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

export function clearValidationFolder(folderPath: string) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const filePath = path.join(folderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        // If it's a directory, recursively delete its contents and the directory itself
        clearValidationFolder(filePath);
      } else {
        // If it's a file, delete the file
        fs.unlinkSync(filePath);
      }
    });
    // After deleting all files and subdirectories, delete the main directory
    fs.rmdirSync(folderPath);
    console.log('Cleared all auth files in validation folder');
  }
}

export function checkIfFileExists({
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
