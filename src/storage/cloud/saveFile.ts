import { Bucket } from '@google-cloud/storage';
import { pathForFileInBucket } from './common';
import { SaveFile } from '../../services';
import { FileDataType } from '../../utilities';

export const SaveFileToCloud = (bucket: Bucket): SaveFile => (file) =>
  // TODO: Refactoring - Reusing logic (No duplicate code)
  new Promise((res, rej) => {
    if(file.fileData.type === FileDataType.Stream) {
      file.fileData.stream.pipe(
        bucket.file(pathForFileInBucket(file))
          .createWriteStream({ resumable: false })
      ).on('finish', () => {
        // TODO: REMOVE WHENEVER YOU ARE READY (Streams-Only)
        if(file.fileData.type === FileDataType.Stream) {
          console.log('REFRESHING FILE:', pathForFileInBucket(file));

          file.fileData.stream = bucket.file(pathForFileInBucket(file)).createReadStream();
        }

        res();
      }).on('error',rej);
    }
  });