import {Component} from '@angular/core';
import {concatMap, debounceTime, filter, map, Observable, Subject, tap} from "rxjs";
import {FormControl} from "@angular/forms";
import {CommuneDto, GeoService} from "../../services/geo.service";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

@Component({
  selector: 'app-search-commune',
  templateUrl: './search-commune.component.html',
  styleUrls: ['./search-commune.component.scss']
})
export class SearchCommuneComponent {

  public filteredOptions$: Observable<CommuneDto[]>;
  public formControl = new FormControl('');
  public options$: Subject<google.maps.MapOptions> = new Subject();

  constructor(private geoService: GeoService) {
    this.filteredOptions$ = this.formControl.valueChanges.pipe(
      filter(value => value !== null),
      debounceTime(500),
      concatMap((value) => geoService.getCommunes(value)),
      map(communes => communes.sort((c1, c2) => c2.population - c1.population)),
      map(communes => communes.slice(0, 5))
    );
  }

  onSelect(event: MatAutocompleteSelectedEvent) {
    const commune: CommuneDto = event.option.value;
    this.geoService.getCommuneCoordinates(commune.code).pipe(
      tap(coordinates => this.options$.next({
        center: {
          lat: coordinates[1],
          lng: coordinates[0]
        }
      }))
    ).subscribe();
  }

  displayFn(object: CommuneDto) {
    return object.nom;
  }

}
