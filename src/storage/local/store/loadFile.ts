import { LocalStorageSettings, pathForLocalFile } from '../common';
import { LoadFile } from '../../../services';
import { fileDataFromBuffer, loadBuffer } from '../../../utilities';

export const LoadFileFromDisk = ({ storagePath }: LocalStorageSettings): LoadFile => {
  const loadData: LoadFile = async (file) => {
    const filepath: string = pathForLocalFile(storagePath, file);

    try {
      file.fileData = await loadBuffer(filepath).then(fileDataFromBuffer);
      
      // NOT USING STREAMS FOR NOW
      // file.fileData = fileDataFromStream(fs.createReadStream(filepath));
    } catch (e) {
      console.log(`Could not load file-data via path "${filepath}"`);

      file.fileData = null;
    }
  };

  return loadData;
};