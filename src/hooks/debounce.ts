import { debounce, DebounceSettings } from 'lodash';
import { useRef } from 'react';

const useDebounce = (fun, wait: number, options?: DebounceSettings) => {
  const ref = useRef<any>();
  if (!ref.current) {
    ref.current = debounce(fun, wait, options);
  }
  return ref.current;
};
export default useDebounce;
