import DocxTemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { DocumentParameters } from '../../models';

export const RenderFile = () => async (data: Buffer, params: DocumentParameters): Promise<Buffer> => {
  console.log('Buffer:', data);
  console.log('Parameters:', params);

  try {
    const zip = new PizZip(data);

    const doc = new DocxTemplater(zip);

    doc.setData(params);

    doc.render();

    const result = doc.getZip().generate({ type: 'nodebuffer' });

    return result;
  } catch(e) {
    console.log('Could not render document', e);

    throw e;
  }
};

export const RenderText = () => async (text: string, params: DocumentParameters): Promise<string> =>
  Object.keys(params).reduce(
    (result, param) => result.replace(new RegExp(`{${param}}`, 'g'), params[param]),
    text,
  );
