import paper from 'paper';
import { SourceMapGenerator } from 'source-map';
import convertSourceMap from 'convert-source-map';


class PipelineRun {
  constructor({ files = [], head = [], tail = [] }) {
    this.files = files;
    this.head = head;
    this.tail = tail;
    this.globals = {};
    console.log(files);
  }

  map() {
    const map = new SourceMapGenerator({ file: 'build' });
    let totalFileLines = 0;
    for (const file of this.files) {
      map.setSourceContent(file.name, file.original);
      for (let i = 0; i < file.content.split('\n').length; i++) {
        map.addMapping({
          source: file.name,
          original: { line: 1 + i, column: 1},
          generated: {
            line: this.combinedHead.split('\n').length + totalFileLines + 3 + i,
            column: 1,
          }
        });
      }
      totalFileLines += file.content.split('\n').length;
    }
    return map;
  }

  get combinedHead() {
    return this.head.join('\n');
  }

  concat() {
    const src = this.combinedHead +
    this.files
      .map(f => 
        f.content)
      .join('\n') +
    this.tail.join('\n') +
    `
    ${convertSourceMap.fromObject(this.map()).toComment()}`
    ;
    console.log(src);
    return src;
  }

  runStep(step) {
    return new PipelineRun({
      head: [...this.head, step.head(this)],
      tail: [...this.tail, step.tail(this)],
      files: this.files.map(file => step.body(file, this)),
      globals: {...this.globals},
    })
  }
}

export default class Pipeline {
  constructor(steps, config = {}) {
    this.steps = steps;
    this.config = config;
  }

  concat(otherPipeline) {
    return new Pipeline([
      ...this.steps,
      ...otherPipeline.steps
    ], {
      ...this.config,
      ...otherPipeline.config,
    });
  }

  run(files) {
    files = files.map(file => ({
      ...file,
      original: file.content,
    }))
    return this.steps.map(step => new step(this.config))
      .reduce(
        (pipelineRun, step) => pipelineRun.runStep(step),
        new PipelineRun({
          files
        })
      )
      .concat();
  }
}