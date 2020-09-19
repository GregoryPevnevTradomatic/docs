import { Bucket } from '@google-cloud/storage';
import { pathForFileInBucket } from './common';
import { LoadFile } from '../../services';
import { fileDataFromBuffer, fileDataFromStream } from '../../utilities';

export const LoadFileFromCloud = (bucket: Bucket): LoadFile =>
  async (file) => {
    const result = await bucket.file(pathForFileInBucket(file)).download();
    file.fileData = fileDataFromBuffer(result[0]);
    // NOT USING STREAMS FOR NOW
    // file.fileData = fileDataFromStream(
    //   bucket.file(pathForFileInBucket(file)).createReadStream()
    // );
  };