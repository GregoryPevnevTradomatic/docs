import fs from 'fs';
import { LocalStorageSettings, pathForLocalFile } from '../common';
import { LoadFile } from '../../../services';
import { fileDataFromStream, FileDataType } from '../../../utilities';

export const LoadFileFromDisk = ({ storagePath }: LocalStorageSettings): LoadFile => {
  const loadData: LoadFile = async (file) => {
    const filepath: string = pathForLocalFile(storagePath, file);

    try {
      if(file.fileData.type === FileDataType.Stream)
        file.fileData = fileDataFromStream(fs.createReadStream(filepath));
    } catch (e) {
      console.log(`Could not load file-data via path "${filepath}"`);

      file.fileData = null;
    }
  };

  return loadData;
};