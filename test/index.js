const requireTestFile = require.context('./', true, /[^.d]\.tsx?$/);
const testFiles = requireTestFile.keys();
testFiles.forEach(requireTestFile);

const requireSourceFile = require.context('../src', true, /[^index][^.d]\.tsx?$/);
const sourceFiles = requireSourceFile.keys();

sourceFiles.forEach(requireSourceFile);
