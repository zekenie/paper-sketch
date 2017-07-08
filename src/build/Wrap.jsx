

// export function head(params) {
//   return `const wrapped = {};`
// }

// export function body(params, file) {
//   return `wrapped[file.name] = function(module, require) {${file.code}};`
// }

import Step from './Step';

export default class wrap extends Step {
  head() {
    return `
      const wrapped = {};
    `;
  }

  body(file) {
    return {
      ...file,
      content: `wrapped['${file.name}'] = function(module, require) {${file.content}};`
    };
  }

  tail() {
    return `
      const exportsCache = {};
      const baseModule = {
        exports: {}
      }
      function require(path) {
        // check cache
        if (exportsCache[path]) {
          return exportsCache[path].exports;
        }

        // if no, run the wrapped function
        exportsCache[path] = Object.assign({}, baseModule)
        wrapped[path](exportsCache[path], require);
        return exportsCache[path].exports;
      };

      // run first script
      require(Object.keys(wrapped)[0]);
    
    `;
  }
}