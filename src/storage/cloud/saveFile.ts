import { Bucket } from '@google-cloud/storage';
import { pathForFileInBucket } from './common';
import { SaveFile } from '../../services';
import { FileDataType, transferStream } from '../../utilities';

export const SaveFileToCloud = (bucket: Bucket): SaveFile => async (file) => {
  switch(file.fileData.type) {
    case FileDataType.Buffer:
      await bucket.file(pathForFileInBucket(file))
        .save(file.fileData.buffer);
      break;
    case FileDataType.Stream:
      await transferStream(
        file.fileData.stream,
        bucket.file(pathForFileInBucket(file))
          .createWriteStream({ resumable: false })
      );
      
      // NOT REFRESHING -> USING BUFFERS FOR NOW BEFORE SWITCHING TO FULL-STREAM
      // file.fileData.stream = bucket.file(pathForFileInBucket(file)).createReadStream();
      break;
  }
};
