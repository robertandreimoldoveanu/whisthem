import styled from '@emotion/styled';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

const StyledApp = styled.div`
  // Your style here
  color: blue;
`;

const URL = 'http://localhost:3333/api';

const App = observer(() => {
  const buttonClicked = useCallback(() => {
    console.log("i've been clicked");
    axios
      .get(URL)
      .then((response) => setData(JSON.stringify(response.data, null, 4)));
  }, []);

  const [data, setData] = useState('');

  const [searchController] = useState(() => new SearchController());

  const handleChange = useCallback(
    (event) => {
      searchController.setValue(event.target.value);
    },
    [searchController]
  );

  useEffect(() => {
    const a = searchController.searchStream$.subscribe((v) => {
      console.log('we should search for ' + v);
    });
    return () => {
      a.unsubscribe();
    };
  }, [searchController]);

  return (
    <StyledApp>
      <h1>Hello world!</h1>
      <TextField
        variant="standard"
        value={searchController.value}
        onChange={handleChange}
      />
      <br />
      <br />
      <br />
      <span>{searchController.value}</span>
      <br />
      <Button onClick={buttonClicked}>Click</Button>
      {data && <pre>{data}</pre>}
    </StyledApp>
  );
});

export default App;

class SearchController {
  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
    this._search$.next(newValue);
  }
  private _value = '';
  private _search$ = new Subject<string>();

  searchStream$ = this._search$.pipe(
    debounceTime(1000),
    distinctUntilChanged()
  );

  constructor() {
    makeAutoObservable(this);
  }

  setValue(value: string) {
    this.value = value;
  }
}
