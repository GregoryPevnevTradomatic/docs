import { Bucket } from '@google-cloud/storage';
import { pathForFileInBucket } from './common';
import { LoadFile } from '../../services';
import { fileDataFromStream } from '../../utilities';

export const LoadFileFromCloud = (bucket: Bucket): LoadFile =>
  async (file) => {
    file.fileData = fileDataFromStream(
      bucket.file(pathForFileInBucket(file)).createReadStream()
    );
  };