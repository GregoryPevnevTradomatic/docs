import { LocalStorageSettings, pathForLocalFile, saveStream } from '../common';
import { SaveFile } from '../../../services';
import { FileDataType, saveBuffer } from '../../../utilities';

export const SaveFileToDisk = ({ storagePath }: LocalStorageSettings): SaveFile =>
  async (file) => {
    const filepath: string = pathForLocalFile(storagePath, file);

    if(file.fileData === null)
      throw new Error('No data attached to the file');
    
    switch(file.fileData.type) {
      case FileDataType.Buffer:
        await saveBuffer(filepath, file.fileData.buffer);
        break;
      case FileDataType.Stream:
        await saveStream(filepath, file.fileData.stream);
        // NOT REFRESHING -> USING BUFFERS FOR NOW BEFORE SWITCHING TO FULL-STREAM
        // file.fileData = fileDataFromStream(fs.createReadStream(filepath));
        break;
      default:
        throw new Error(`Could not save file with the following data: ${String(file.fileData.type)}`);
    }
  };