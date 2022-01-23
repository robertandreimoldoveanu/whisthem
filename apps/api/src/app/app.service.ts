/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  CharacterMatch,
  CharacterMatchResponse,
  CreditsApiResponse,
  MovieApiResponse,
  PersonCombinedCreditsResponse,
  SearchApiResponse,
  TvApiResponse,
} from '@roanm/models';
import { AxiosResponse } from 'axios';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private http: HttpService) {
    http.axiosRef.defaults.headers.common[
      'authorization'
    ] = `Bearer ${process.env.TMDB_TOKEN}`;
  }

  searchCharacters({
    type,
    season,
    episode,
    title,
    character,
  }: SearchCharactersParams): Observable<CharacterMatchResponse> {
    return this.http
      .get<SearchApiResponse<TvApiResponse | MovieApiResponse>>(
        `${tmdbBaseUrl}/search/${type}?query=${encodeURIComponent(title)}`
      )
      .pipe(
        map(
          (response) =>
            response.data.results.sort((a, b) => b.popularity - a.popularity)[0]
              .id
        ),
        switchMap((id) => this.getCreditsReq(type, id, season, episode)),
        map(this.creditsResponseToCharacters),
        map((characters) => {
          const matches = characters.filter((c) =>
            c.character.toLowerCase().includes(character.toLowerCase())
          );
          return { matches };
        }),
        catchError((e) => {
          console.log('error', e);
          return of(null);
        })
      );
  }

  getOtherWorks({ actorId }) {
    return this.http
      .get<PersonCombinedCreditsResponse>(
        `${tmdbBaseUrl}/person/${actorId}/combined_credits`
      )
      .pipe(
        map((r) => r.data),
        map((data) =>
          data.cast.map((c) => ({
            ...c,
            poster_path: c.poster_path
              ? `${photoBase}${c.poster_path}`
              : undefined,
          }))
        )
      );
  }

  private getCreditsReq(
    type: string,
    id: number,
    season: string,
    episode: string
  ) {
    if (type === 'tv') {
      return this.http.get(
        `${tmdbBaseUrl}/${type}/${id}/season/${season}/episode/${episode}/credits`
      );
    } else {
      return this.http.get(`${tmdbBaseUrl}/${type}/${id}/credits`);
    }
  }

  private creditsResponseToCharacters(
    creditsResponse: AxiosResponse<CreditsApiResponse>
  ): CharacterMatch[] {
    return [
      ...creditsResponse.data.cast,
      ...creditsResponse.data.guest_stars,
    ].map((credit) => ({
      character: credit.character,
      profilePath: `${photoBase}/${credit.profile_path}`,
      name: credit.name,
      popularity: credit.popularity,
      id: credit.id,
    }));
  }
}

const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const photoBase = 'https://image.tmdb.org/t/p/w500';
interface SearchCharactersParams {
  type: string;
  season: string;
  episode: string;
  title: string;
  character: string;
}
