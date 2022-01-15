import styled from '@emotion/styled';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { SearchController } from './search-controller';
import { useStreamEffect } from './use-stream';

const StyledApp = styled.div`
  // Your style here
  color: blue;
`;

const TextSearch = observer(() => {
  const [searchController] = useState(() => new SearchController());

  const handleChange = useCallback(
    (event) => {
      searchController.setValue(event.target.value);
    },
    [searchController]
  );

  useEffect(() => {
    if (searchController.query) {
      console.log('we should search for ' + searchController.query);
    }
  }, [searchController.query]);

  // useEffect(() => {
  //   const a = searchController.intervalStream$.subscribe((v) =>
  //     console.log('hello', v)
  //   );
  //   return () => {
  //     a.unsubscribe();
  //   };
  // }, [searchController]);

  const [query] = useStreamEffect(searchController.intervalStream$, (v) =>
    console.log('useStreamEffect', v, 'and', searchController.value)
  );

  return (
    <>
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
      <p>Here is: {query}</p>
    </>
  );
});

const URL = 'http://localhost:3333/api';

const App = () => {
  const [show, setShow] = useState(false);
  const buttonClicked = useCallback(() => {
    console.log("i've been clicked");
    setShow(!show);
    axios
      .get(URL)
      .then((response) => setData(JSON.stringify(response.data, null, 4)));
  }, [show]);

  const [data, setData] = useState('');

  return (
    <StyledApp>
      {show && <TextSearch />}
      <br />
      <Button onClick={buttonClicked}>Click</Button>
      {data && <pre>{data}</pre>}
    </StyledApp>
  );
};

export default App;
