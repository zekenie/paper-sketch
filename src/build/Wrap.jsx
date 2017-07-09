
import { SourceMapGenerator } from 'source-map';
import mergeSourceMaps from 'merge-source-map'
import Step from './Step';

export default class wrap extends Step {
  head() {
    return `
      const wrapped = {};
    `;
  }

  body(file) {
    // const map = new SourceMapGenerator({ file: file.name });
    // map.addMapping({
    //   source: file.name,
    //   original: {
    //     line: 1,
    //     column: 1
    //   },
    //   generated: {
    //     line: 2,
    //     column: 1,
    //   },
    // });
    return {
      ...file,
      // map: mergeSourceMaps(file.map, map.toJSON()),
      content: `wrapped['${file.name}'] = function(module, require) {
${file.content}
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
      require(Object.keys(wrapped)[0]);
    
    `;
  }
}