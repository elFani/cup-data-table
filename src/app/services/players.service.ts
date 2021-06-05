// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// RXJS
import { BehaviorSubject, Observable } from 'rxjs';

// Environment
import { environment } from '../environment/environment';

// Models
import { Roster } from '../models/player.model';

//Services

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  private authOptions = {};
  private roster: Roster = {};
  private rosterSource = new BehaviorSubject<Roster>(this.roster);
  roster$ = this.rosterSource.asObservable();

  constructor(private httpClient: HttpClient) {
    this.authOptions = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + environment.key })
    };
  }

  getCurrentRoster(): Observable<Roster> {
    const endpoint = environment.rosterAPI;
    return this.httpClient.get<Roster>(endpoint, this.authOptions);
  }

  setRoster(newRoster: Roster) {
    this.rosterSource.next(newRoster);
  }

  getRoster(): Roster {
    return this.rosterSource.value;
  }
}
