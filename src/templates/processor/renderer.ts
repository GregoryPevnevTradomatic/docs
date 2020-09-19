import DocxTemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { DocumentParameters, formatParameters } from '../../models';

export const RenderFile = () => async (data: Buffer, params: DocumentParameters): Promise<Buffer> => {
  try {
    const zip = new PizZip(data);

    const doc = new DocxTemplater(zip);

    doc.setData(formatParameters(params));

    doc.render();

    const result = doc.getZip().generate({ type: 'nodebuffer' });

    return result;
  } catch(e) {
    console.log('Could not render document', e);

    throw e;
  }
};

export const RenderText = () => async (text: string, { names, values }: DocumentParameters): Promise<string> =>
  names.reduce(
    (result, param, index) => result.replace(new RegExp(`{${param}}`, 'g'), values[index]),
    text,
  );
