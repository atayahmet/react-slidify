import get from '@util-funcs/object-get';
import pick from '@util-funcs/pick';
import { PARAMS_KEY } from './contants';
import { IEventPoint } from './interfaces';

export default function trigger(name: string, deps: any[]) {
  const options = deps[deps.length - 1];
  const callback = get(name, options, () => null);

  // replace object of coordinates
  deps.splice(0, 1, pick(deps[0], PARAMS_KEY) as IEventPoint);

  // remove last item (options parameter)
  deps.splice(-1);

  callback.call(null, ...deps);
}
