const babelCodeFrame = require('@babel/code-frame');
codeFrame = babelCodeFrame.default;
codeFrameColumns = babelCodeFrame.codeFrameColumns
console.log(codeFrame);
const rawLines = `class Foo {
  constructor(){

  }
}`;
const lineNumber = 2;
const colNumber = 16;

const result = codeFrame(rawLines, lineNumber, colNumber, { highlightCode:true });

console.log(result);