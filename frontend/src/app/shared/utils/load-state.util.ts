import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, map, of, startWith } from 'rxjs';

export type LoadState<T> =
  | { status: 'loading'; data: T }
  | { status: 'ready'; data: T }
  | { status: 'error'; data: T };

/** Wraps a one-shot request as a signal with explicit loading / ready / error states. */
export function loadState<T>(source: Observable<T>, empty: T): Signal<LoadState<T>> {
  return toSignal(
    source.pipe(
      map((data): LoadState<T> => ({ status: 'ready', data })),
      catchError(() => of<LoadState<T>>({ status: 'error', data: empty })),
      startWith<LoadState<T>>({ status: 'loading', data: empty }),
    ),
    { requireSync: true },
  );
}
