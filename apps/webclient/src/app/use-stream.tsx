import { useCallback, useEffect, useState } from 'react';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

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

export const useSubject$ = <T,>(
  initialValue?: any
): [Subject<any>, (value: any) => void] => {
  const [subject$] = useState<Subject<T> | BehaviorSubject<T>>(
    initialValue !== undefined
      ? new BehaviorSubject(initialValue)
      : new Subject()
  );

  const next = useCallback(
    (value) => {
      subject$.next(value);
    },
    [subject$]
  );

  return [subject$, next];
};
