import { get } from './getters';

export default function trigger(name: string, deps: any[]) {
  const [, , , options] = deps;
  const callback = get(name, options, () => null);
  callback.call(null, ...deps);
}
