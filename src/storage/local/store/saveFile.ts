import fs from 'fs';
import { LocalStorageSettings, pathForLocalFile, saveStream } from '../common';
import { SaveFile } from '../../../services';
import { fileDataFromStream, FileDataType } from '../../../utilities';

export const SaveFileToDisk = ({ storagePath }: LocalStorageSettings): SaveFile =>
  async (file) => {
    const filepath: string = pathForLocalFile(storagePath, file);

    if(file.fileData === null)
      throw new Error('No data attached to the file');
    
    if (file.fileData.type === FileDataType.Stream) {
      await saveStream(filepath, file.fileData.stream);

      // TODO: Getting rid of this shit (using stream in parallel)
      // Opening new stream to produce data for the Upload / Further operations
      file.fileData = fileDataFromStream(fs.createReadStream(filepath));
    }
  };