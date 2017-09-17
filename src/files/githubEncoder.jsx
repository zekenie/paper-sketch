export function encode(files) {
  return files.reduce(
    (files, file) => {
      if (file.content) {
        files[file.name] = { content: file.content }
      } else {
        files[file.name] = null;
      }

      if (file.testContent) {
        files[`__test__${file.name}`] = { content: file.testContent }
      } else {
        files[`__test__${file.name}`] = null;
      }
      return files;
    },
    {}
  );
}

export function decode(githubObj) {
  githubObj = {...githubObj};
  for (const filename of Object.keys(githubObj)) {
    if (filename.startsWith('__test__')) {
      const masterFilename = filename.split('__test__').pop();
      githubObj[masterFilename].testContent = githubObj[filename].content;
      delete githubObj[filename];
    } else {
      githubObj[filename].name = filename;
    }
  }
  return Object.values(githubObj)
}