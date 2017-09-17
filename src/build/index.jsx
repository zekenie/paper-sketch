import Pipeline from './Pipeline';
import Wrap from './Wrap';

const pipeline = new Pipeline([
  Wrap,
]);

export default function(files) {
  return pipeline.run(files);
}