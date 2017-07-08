export default class Step {
  constructor(config) {
    this.config = config;
  }

  head(pipelineRun) {
    return '';
  }
  body(file, pipelineRun) {
    return '';
  }
  tail(pipelineRun) {
    return '';
  }
}

