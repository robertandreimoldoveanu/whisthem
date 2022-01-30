import {
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';

import isEqual from 'lodash.isequal';
import { observer } from 'mobx-react-lite';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  skip,
} from 'rxjs';

import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  styled,
  TextField,
} from '@mui/material';
import {
  Action,
  SearchFormActions,
  SearchFormFields,
  SearchFormPayload,
  SearchFormProps,
  SearchFormState,
} from '@roanm/models';

const StyledSearchForm = styled(Paper)(() => ({
  width: '400px',
  margin: '0 auto',
  padding: '16px',
}));

const defaults: Record<SearchFormFields, string> = {
  type: 'tv',
  season: '1',
  episode: '1',
  title: '',
  character: '',
};

function reducer(
  state: SearchFormState,
  action: Action<SearchFormActions, SearchFormPayload>
) {
  switch (action.type) {
    case 'set':
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
      };
    default:
      throw new Error('Invalid action type');
  }
}

const createSetAction = (
  prop: SearchFormFields,
  value: string
): Action<SearchFormActions, SearchFormPayload> => ({
  type: 'set',
  payload: { prop, value },
});

export const SearchForm = observer((props: SearchFormProps): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, defaults);
  const [source$] = useState(() => new BehaviorSubject(state));

  const onChange = useCallback(
    (event) => {
      dispatch(createSetAction(event.target.name, event.target.value));
    },
    [dispatch]
  );

  useEffect(() => {
    source$.next(state);
  }, [state]);

  useEffect(() => {
    const sub$ = source$
      .pipe(
        skip(1),
        debounceTime(750),
        distinctUntilChanged(isEqual),
        filter((state) => state.title.length > 0 && state.character.length > 0)
      )
      .subscribe(props.searchValueChange);

    return () => sub$.unsubscribe();
  }, [props.searchValueChange]);

  return (
    <StyledSearchForm elevation={3}>
      <Box
        component="form"
        autoComplete="off"
        noValidate
        sx={{
          '& .MuiTextField-root': { m: 1 },
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <FormControl component="fieldset">
          <FormLabel component="legend">Type</FormLabel>
          <RadioGroup
            aria-label="type"
            name={SearchFormFields.TYPE}
            value={state.type}
            onChange={onChange}
          >
            <div>
              <FormControlLabel
                value="tv"
                control={<Radio size="small" />}
                label="Series"
              />
              <FormControlLabel
                value="movie"
                control={<Radio size="small" />}
                label="Movie"
              />
            </div>
          </RadioGroup>
        </FormControl>
        {state.type === 'tv' && (
          <div>
            <TextField
              size="small"
              label="Season"
              name={SearchFormFields.SEASON}
              type="number"
              value={state.season}
              sx={{ width: '10ch' }}
              onChange={onChange}
            />
            <TextField
              size="small"
              label="Episode"
              name={SearchFormFields.EPISODE}
              type="number"
              value={state.episode}
              sx={{ width: '10ch' }}
              onChange={onChange}
            />
          </div>
        )}
        <div>
          <TextField
            size="small"
            label="Title"
            name={SearchFormFields.TITLE}
            type="text"
            value={state.title}
            sx={{ width: '25ch' }}
            onChange={onChange}
          />
          <TextField
            size="small"
            label="Character"
            name={SearchFormFields.CHARACTER}
            type="text"
            value={state.character}
            sx={{ width: '25ch' }}
            onChange={onChange}
          />
        </div>
      </Box>
    </StyledSearchForm>
  );
});
