import paper from 'paper';
import Step from './Step';

window.paper = paper;

export default class Paper extends Step {
  head(pipelineRun) {
    pipelineRun.globals.toInject = [
      ...(pipelineRun.globals.toInject || []),
      paper.Path,
    ];
  }

  body(file) {
    try {
      const parsed = paper.PaperScript.compile(file.content);
      return {
        ...file,
        content: parsed.code,
      };
    } catch(e) {
      console.error(e);
    }
  }
}