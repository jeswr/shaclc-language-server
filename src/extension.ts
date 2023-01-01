import * as vscode from 'vscode';
import { parse } from 'shaclc-parse';
import { write } from 'shaclc-write';

export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerDocumentFormattingEditProvider('shaclc', {
    async provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
      const extendedSyntax = document.fileName.endsWith('e');
      const { text } = await write(parse(document.getText(), { extendedSyntax }), { extendedSyntax, mintPrefixes: true })
      return [
        vscode.TextEdit.replace(
          new vscode.Range(new vscode.Position(0, 0), document.lineAt(document.lineCount - 1).range.end),
          text
        )
      ]
    }
  });
}
