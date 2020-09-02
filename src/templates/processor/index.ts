import { DocumentParameters } from '../../models';
import { ParseDocument, ParseText } from './parser';
import { RenderDocument, RenderText } from './renderer';

export interface DocumentTemplateProcessor {
  parseDocument(data: Buffer): Promise<string[]>;
  parseText(text: string): Promise<string[]>;
  renderDocument(data: Buffer, params: DocumentParameters): Promise<Buffer>;
  renderText(text: string, params: DocumentParameters): Promise<string>;
}

export const createTempateProcessor = (): DocumentTemplateProcessor => ({
  parseDocument: ParseDocument(),
  parseText: ParseText(),
  renderDocument: RenderDocument(),
  renderText: RenderText(),
});
