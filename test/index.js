const requireTestFile = require.context('./', true, /[^.d]\.tsx?$/);
const testFiles = requireTestFile.keys();

testFiles.forEach(requireTestFile);
