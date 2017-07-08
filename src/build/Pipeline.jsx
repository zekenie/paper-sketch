class PipelineRun {
  constructor({ files = [], head = [], tail = [] }) {
    this.files = files;
    this.head = head;
    this.tail = tail;
    this.globals = {};
    console.log(files);
  }

  concat() {
    console.log(this);
    return this.head.join('\n') + this.files.map(f => f.content).join('\n') + this.tail.join('\n');
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