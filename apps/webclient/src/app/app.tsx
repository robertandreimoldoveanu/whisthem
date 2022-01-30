import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import axios, { AxiosRequestConfig } from 'axios';
import {
  defer,
  filter,
  map,
  Observable,
  Subscription,
  tap,
} from 'rxjs';

import {
  Box,
  styled,
} from '@mui/material';
import {
  CharacterMatch,
  CharacterMatchResponse,
  PersonCreditResponse,
  SearchFormState,
} from '@roanm/models';

import { CharacterCard } from './character-card';
import { SearchForm } from './search-form';
import { VisualWorksCard } from './visual-work-card';

const StyledApp = styled(Box)(() => ({
  width: '400px',
  margin: '0 auto',
  padding: '16px',
}));

const URL = 'http://localhost:3333/api';

const App = () => {
  const [searchValue, setSearchValue] = useState({} as SearchFormState);
  const [matches, setMatches] = useState([] as CharacterMatch[]);
  const [otherWorks, setOtherWorks] = useState<PersonCreditResponse[]>([]);
  const [actorId, setActorId] = useState<number | null>(null);
  const [actorData, setActorData] = useState<CharacterMatch | null>(null);

  useEffect(() => {
    if (searchValue.character && searchValue.title) {
      setMatches([]);
      setActorId(null);
      const a = http
        .get$<CharacterMatchResponse>(
          `${URL}/searchCharacters/${getQueryForState(searchValue)}`
        )
        .pipe(
          tap((data) => data.matches.length !== 1 && setMatches(data.matches)),
          filter((data) => data.matches.length === 1 ),
          tap((data) => (setActorId(data.matches[0].id), setActorData(data.matches[0])))
        )
        .subscribe();

      return () => a.unsubscribe();
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [searchValue]);

  const onMatchClicked = useCallback(
    (id) => {
      setActorId(id);
      setMatches([]);
    },
    [setActorId]
  );

  useEffect(() => {
    let sink$ = new Subscription();
    if (actorId) {
      sink$ = http
        .get$<PersonCreditResponse[]>(`${URL}/otherWorks?actorId=${actorId}`)
        .pipe(tap((data) => setOtherWorks(data)))
        .subscribe();
    }

    return () => sink$.unsubscribe();
  }, [actorId]);

  return (
    <StyledApp>
      <h3>Made possible by <a href="https://www.themoviedb.org/">TMDB</a></h3>
      <SearchForm searchValueChange={setSearchValue} />
      {actorData && <CharacterCard {...actorData} />}
      {matches.length > 0 && (
        <div>
          {matches.map((m) => (
            <CharacterCard
              {...m}
              onClick={() => onMatchClicked(m.id)}
              key={m.id}
            />
          ))}
        </div>
      )}
      {otherWorks.length > 0 && (
        <div>
          {otherWorks.map((m, idx) => (
            <VisualWorksCard key={idx + '-' + m.id + (m.name || m.title || '')} {...m} actor={actorData?.name || ''} />
          ))}
        </div>
      )}
    </StyledApp>
  );
};

export default App;

function getQueryForState<T>(state: T) {
  const queryElements = [];
  for (const prop in state) {
    queryElements.push(`${prop}=${encodeURIComponent(String(state[prop]))}`);
  }
  return queryElements.length ? `?${queryElements.join('&')}` : '';
}

class HttpService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get$<T>(url: string, extras?: AxiosRequestConfig<any>): Observable<T> {
    return defer(() => axios.get<T>(url, extras)).pipe(map((r) => r.data));
  }
}

export const http = new HttpService();
