import { get } from './getters';

export default function trigger(name: string, deps: any[]) {
  const options = deps[deps.length - 1];
  const callback = get(name, options, () => null);
  callback.call(null, ...deps);
}
