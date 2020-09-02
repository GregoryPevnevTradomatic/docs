import DocxTemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { DocumentParameters } from '../../models';

export const RenderFile = () => async (data: Buffer, params: DocumentParameters): Promise<Buffer> => {
  const zip = new PizZip(data);

  try {
    const doc = new DocxTemplater(zip);

    doc.setData(params);

    doc.render();

    const result = doc.getZip().generate({ type: 'nodebuffer' });

    return result;
  } catch(e) {
    console.log('Could not render document', e);

    return null;
  }
};

export const RenderText = () => async (text: string, params: DocumentParameters): Promise<string> =>
  Object.keys(params).reduce(
    (result, param) => result.replace(new RegExp(`{${param}}`, 'g'), params[param]),
    text,
  );
