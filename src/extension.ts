import * as vscode from 'vscode';
import { parse } from 'shaclc-parse';
import { write } from 'shaclc-write';
// import { Store, DataFactory as DF, Term } from 'n3';
// import * as RDF from '@rdfjs/types';

// function getIgnoredProperties(nodeShape: Term, store: Store): false | RDF.Quad[] {
//   // Merge ignored properties

//   const ignored: RDF.Term[] = [];
//   const quads = []

//   console.log(
//     nodeShape,
//     'boo',
//     // store.getQuads(null, DF.namedNode('http://www.w3.org/ns/shacl#ignoredProperties'), null, null),
//     store.getQuads(nodeShape, DF.namedNode('http://www.w3.org/ns/shacl#ignoredProperties'), null, null)
//   )

//   for (const propertyShape of store.getQuads(nodeShape, DF.namedNode('http://www.w3.org/ns/shacl#ignoredProperties'), null, null)) {
//     let node = propertyShape.object;

//     console.log('found node', node)

//     quads.push(propertyShape);

//     while (!DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#nil').equals(node)) {
//       const nodes = store.getQuads(nodeShape, DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#rest'), null, null)
//       const first = store.getQuads(nodeShape, DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#first'), null, null)

//       quads.push(
//         ...nodes,
//         ...first
//       );

//       console.log(nodes, first)

//       if (nodes.length === 1 && first.length === 1) {
//         node = nodes[0].object;
//         ignored.push(first[0].object)
//       } else {
//         return false;
//       }
//     }
//   }

//   store.removeQuads(quads);
//   return quads;
// }

// function merge(quads: RDF.Quad[]) {
//   const store = new Store(quads);
//   for (const nodeShape of store.match(null, DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), DF.namedNode('http://www.w3.org/ns/shacl#NodeShape'))) {

//   const ignoredProperties = getIgnoredProperties(nodeShape.object as any, store);
//   console.log('the ignored properties are', ignoredProperties)
  
//     for (const propertyShape of store.getObjects(nodeShape.object as any, DF.namedNode('http://www.w3.org/ns/shacl#property'), null)) {
//       if (propertyShape.termType === 'BlankNode') {

//       }
//     }
//   }
// }

export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerDocumentFormattingEditProvider('shaclc', {
    async provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
      try {
        const extendedSyntax = document.fileName.endsWith('e');
        const quads = parse(document.getText(), { extendedSyntax });
        const { text } = await write(quads, { extendedSyntax, mintPrefixes: true, prefixes: quads.prefixes })
        return [
          vscode.TextEdit.replace(
            new vscode.Range(new vscode.Position(0, 0), document.lineAt(document.lineCount - 1).range.end),
            text
          )
        ]
      } catch (e) {
        vscode.window.showErrorMessage(`${e}`);
        return [];
      }
    }
  });
}
