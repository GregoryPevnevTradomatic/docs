import { DocumentParameters } from '../../models';
import { ParseFile, ParseText } from './parser';
import { RenderFile, RenderText } from './renderer';

export interface DocumentTemplateProcessor {
  parseFile(data: Buffer): Promise<string[]>;
  parseText(text: string): Promise<string[]>;
  renderFile(data: Buffer, params: DocumentParameters): Promise<Buffer>;
  renderText(text: string, params: DocumentParameters): Promise<string>;
}

export const createTempateProcessor = (): DocumentTemplateProcessor => ({
  parseFile: ParseFile(),
  parseText: ParseText(),
  renderFile: RenderFile(),
  renderText: RenderText(),
});
