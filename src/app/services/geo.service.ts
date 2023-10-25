import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  private BASE_URL = 'https://geo.api.gouv.fr';

  constructor(private httpClient: HttpClient) {
  }

  public getCommunes(search: string): Observable<CommuneDto[]> {
    const url = `${this.BASE_URL}/communes`;
    return this.httpClient.get<CommuneDto[]>(url, {params: {nom: search}});
  }

  public getCommuneCoordinates(code: string): Observable<number[]> {
    const url = `${this.BASE_URL}/communes/${code}`;
    return this.httpClient.get<CommuneInfoDto>(url, {params: {format: "geojson", geometry: "mairie"}}).pipe(
      map(info => info.geometry.coordinates)
    );
  }
}

export interface CommuneDto {
  nom: string;
  code: string;
  population: number;
}

export interface CommuneInfoDto {
  geometry: GeometryDto;
}

export interface GeometryDto {
  coordinates: number[];
}
