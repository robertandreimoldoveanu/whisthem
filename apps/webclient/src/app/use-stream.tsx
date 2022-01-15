import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export const useStreamValue = <T,>(stream$: Observable<T>) => {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    const sink = stream$.subscribe({
      next: (v) => setValue(v),
    });
    return () => {
      sink.unsubscribe();
    };
  }, [stream$]);

  return [value];
};

export const useStreamEffect = <T, K>(
  stream$: Observable<T>,
  effect: (arg0: T) => K
) => {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    const sink = stream$.subscribe({
      next: (v) => {
        setValue(v);
        effect(v);
      },
    });
    return () => {
      sink.unsubscribe();
    };
  }, [stream$]);

  return [value];
};
