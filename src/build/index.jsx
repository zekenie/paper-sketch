import Pipeline from './Pipeline';
import Wrap from './Wrap';
// import Paper from './Paper';

const pipeline = new Pipeline([
  Wrap,
  // Paper,
]);

export default function(files) {
  return pipeline.run(files);
}