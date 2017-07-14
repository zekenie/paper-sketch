
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
      content: `wrapped['${file.name}'] = function(module, require) {
${file.content}
      };
      `,
      testContent: `wrapped['__test__${file.name}'] = function(module, require) {
        const module = require('${file.name}');
${file.testContent}
      };
      `
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
      if(window.__test__) {
        for (const name of Object.keys('wrapped')) {
          if (name.startsWith('__test__')) {
            require(name);
          }
        }
      } else {
        require(Object.keys(wrapped)[0]);
      }
    
    `;
  }
}