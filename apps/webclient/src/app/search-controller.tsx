import { makeAutoObservable } from 'mobx';
import {
  debounceTime,
  distinctUntilChanged,
  interval,
  map,
  Subject,
  take,
} from 'rxjs';

export class SearchController {
  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
    this._search$.next(newValue);
  }
  query: string | undefined;

  intervalStream$ = interval(1000).pipe(take(5));

  private _value = '';
  private _search$ = new Subject<string>();

  queryStream$ = this._search$.pipe(
    map((q) => q.trim()),
    debounceTime(1000),
    distinctUntilChanged(),
    map((query) => (query.length > 0 ? query : undefined))
  );

  constructor() {
    makeAutoObservable(this);
  }

  setValue(value: string) {
    this.value = value;
  }

  setQuery(value: string | undefined) {
    this.query = value;
  }
}
