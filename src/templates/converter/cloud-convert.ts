import CloudConvert from 'cloudconvert';
import https from 'https';
import { downloadStreamFromURL } from '../../utilities';

type DataStream = NodeJS.ReadableStream;

const TASK_FILE_NAME = 'file.docx';

export const ConvertDocxToPdf = (cloudConvert: CloudConvert) =>
  async (document: DataStream): Promise<DataStream> => {
    let job = await cloudConvert.jobs.create({
      tasks: {
          // Input Task -> Upload (Via Stream)
          'upload-my-file': {
              operation: 'import/upload'
          },
          // Conversion Task
          'convert-my-file': {
              operation: 'convert',
              input: 'upload-my-file',
              input_format: 'docx',
              output_format: 'pdf'
          },
          // Output Task -> Download (Via URL and Stream)
          'export-my-file': {
              operation: 'export/url',
              input: 'convert-my-file'
          }
      }
    });
    
    const uploadTask = job.tasks.filter(task => task.name === 'upload-my-file')[0];
    
    await cloudConvert.tasks.upload(uploadTask, document, TASK_FILE_NAME);
    
    job = await cloudConvert.jobs.wait(job.id);
    
    const exportTask = job.tasks.filter(
        task => task.name === 'export-my-file'
    )[0];
    const file = exportTask.result.files[0];
    
    return downloadStreamFromURL(file.url);
  };
