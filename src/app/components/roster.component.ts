import { Component } from '@angular/core';
import { BehaviorSubject,combineLatest } from 'rxjs';

//Models
import { FlatPlayer, Player, Roster } from '../models/player.model';

//Services
import { PlayersService } from '../services/players.service';

const flattenObject = (obj, prefix = '') =>
  Object.keys(obj).reduce((acc, k) => {
    // const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object') Object.assign(acc, flattenObject(obj[k], k));
    else acc[k] = obj[k];
    return acc;
  }, {});

@Component({
  selector: 'roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})

export class RosterComponent {
  players$ = new BehaviorSubject<Player[]>([]);
  flatPlayers$ = new BehaviorSubject<FlatPlayer[]>([]);
  flatPlayersDisplay$ = new BehaviorSubject<FlatPlayer[]>([]);
  displayRoster$ = new BehaviorSubject<Player[]>([]);
  rosterColumns$ = new BehaviorSubject<string[]>([
    'name',
    'position',
    'paid',
    'email',
    'address',
    'notes'
  ]);
  sortKey$ = new BehaviorSubject<string>('Name');
  sortDirection$ = new BehaviorSubject<string>('asc');


  constructor(private playerService: PlayersService) {}

  ngOnInit() {
    this.playerService.getCurrentRoster().subscribe((roster: Roster) => {
      this.displayRoster$.next(Object.values(roster.records))
      console.log(this.displayRoster$.value);
      this.players$.next(Object.values(roster.records))
      const flat = Object.values(roster.records);
      this.flatPlayers$.next(flat.map(el => flattenObject(el)))
      this.flatPlayersDisplay$.next(this.flatPlayers$.value)
      console.log('flatplayers',this.flatPlayersDisplay$.value);

    });

    combineLatest([this.flatPlayers$, this.sortKey$, this.sortDirection$])
      .subscribe(([players, sortKey, sortDirection]) => {
        console.log('inside combine', sortKey, sortDirection, players);

        const rosterArray = Object.values(players);
        // let filteredRoster: any[] = rosterArray;

        // if (!searchTerm) {
        //   filteredHeroes = heroesArray;
        // } else {
        //   const filteredResults = heroesArray.filter(hero => {
        //     return Object.values(hero)
        //       .reduce((prev, curr) => {
        //         return prev || curr.toString().toLowerCase().includes(searchTerm.toLowerCase());
        //       }, false);
        //   });
        //   filteredHeroes = filteredResults;
        // }

        const nextSort = rosterArray.sort((a, b) => {
          console.log('inside .sort',a, b, a[sortKey], b[sortKey]);
          if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
          if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
          return 0;
        });

        console.log('nextsort',nextSort);


        this.flatPlayersDisplay$.next(nextSort);
      });

    // this.searchFormControl.setValue('');
  }
  adjustSort(key: string) {
    console.log('inside adjustsort', this.sortKey$.value, this.sortDirection$.value);

    if (this.sortKey$.value === key) {
      if (this.sortDirection$.value === 'asc') {
        this.sortDirection$.next('desc');
      } else {
        this.sortDirection$.next('asc');
      }
      return;
    }

    this.sortKey$.next(key);
    this.sortDirection$.next('asc');
  }
}



  // onSort({ column, direction }: SortEvent) {
  //   console.log('inside onSort');

  //   // resetting other headers
  //   this.headers.forEach(header => {
  //     if (header.sortable !== column) {
  //       header.direction = '';
  //     }
  //   });

  //   // sorting countries
  //   if (direction === '' || column === '') {
  //     this.displayRoster = this.sourceRoster;
  //   } else {
  //     this.displayRoster = [...this.sourceRoster].sort((a, b) => {
  //       const colValA = column.split('.').reduce((o, i) => o[i], a); // takes the column in dot notation and retrieves value for the obj passed in as the last argument in the reduce function
  //       const colValB = column.split('.').reduce((o, i) => o[i], b);
  //       const res = compare(`${colValA}`, `${colValB}`);
  //       return direction === 'asc' ? res : -res;
  //     });
  //   }
  // }

