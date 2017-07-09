import paper from 'paper';
import Step from './Step';

window.paper = paper;

export default class Paper extends Step {

  // whole(pipelineRun) {

  // }

  // body(file) {
  //   try {
  //     const parsed = paper.PaperScript.compile(file.content, {
  //       url: file.name,
  //       source: file.content,
  //       sourceMaps: true,
  //     });
  //     return {
  //       ...file,
  //       content: parsed.code,
  //       map: parsed.map,
  //     };
  //   } catch(e) {
  //     console.error(e);
  //   }
  // }
}