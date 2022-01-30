import { ReactNode } from 'react';

export interface CreditsReponseEntry {
  character: string;
  profile_path: string;
  name: string;
  popularity: number;
  credit_id: number;
  id: number;
}

export interface CharacterMatch {
  character: string;
  name: string;
  popularity: number;
  profilePath: string;
  id: number;
}

export interface SearchApiResponse<T extends VisualWorkApiResponse> {
  results: T[];
}

export interface VisualWorkApiResponse {
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  id: number;
  vote_average: number;
  overview: string;
  vote_count: number;
  genre_ids: number[];
}

export interface TvApiResponse extends VisualWorkApiResponse {
  name: string;
  original_name: string;
}

export interface MovieApiResponse extends VisualWorkApiResponse {
  title: string;
  original_title: string;
}

export interface CharacterCreditApiResponse {
  id: number;
  name: string;
  popularity: number;
  character: string;
  profile_path: string | null;
}

export interface CreditsApiResponse {
  cast: CharacterCreditApiResponse[];
  guest_stars: CharacterCreditApiResponse[];
}

export interface PersonCreditResponse extends VisualWorkApiResponse {
  character: string;
  name?: string;
  original_name?: string;
  title?: string;
  original_title?: string;
}

export interface PersonCombinedCreditsResponse {
  cast: PersonCreditResponse[];
}

export interface CharacterMatchResponse {
  matches: CharacterMatch[];
}

export interface ReactProps {
  children?: ReactNode;
}

export interface Action<T, K> {
  type: T;
  payload: K;
}

export interface SearchFormProps extends ReactProps {
  prop?: string;
  searchValueChange: (value: SearchFormState) => void;
}

export enum SearchFormFields {
  TYPE = 'type',
  SEASON = 'season',
  EPISODE = 'episode',
  TITLE = 'title',
  CHARACTER = 'character',
}

export type SearchFormState = Record<SearchFormFields, string>;

export interface SearchFormPayload {
  prop: SearchFormFields;
  value: string;
}

export type SearchFormActions = 'set';
