import { Component } from '@angular/core';
import { BehaviorSubject,combineLatest } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  searchControl = new FormControl();


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

    combineLatest([this.flatPlayers$, this.sortKey$, this.sortDirection$, this.searchControl.valueChanges])
      .subscribe(([players, sortKey, sortDirection, searchInput]) => {
        console.log('inside combine', sortKey, sortDirection, players);

        const rosterArray = Object.values(players);
        let filteredRoster: FlatPlayer[] = [];

        if (!searchInput) {
          filteredRoster = rosterArray;
        } else {
          const filteredResults = rosterArray.filter(hero => {
            return Object.values(hero)
              .reduce((prev, curr) => {
                return prev || curr.toString().toLowerCase().includes(searchInput.toLowerCase());
              }, false);
          });
          filteredRoster = filteredResults;
        }

        const nextSort = filteredRoster.sort((a, b) => {
          console.log('inside .sort',a, b, a[sortKey], b[sortKey]);
          if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
          if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
          return 0;
        });

        console.log('nextsort',nextSort);


        this.flatPlayersDisplay$.next(nextSort);
      });

    this.searchControl.setValue('');
  }

  adjustSort(key: string) {
    console.log('inside adjustsort', this.sortKey$.value, this.sortDirection$.value,key);

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

  drop(event: CdkDragDrop<string[]>) {
    console.log('inside drop');
    //make a static array with the current columns
    const newColumns: string[] = this.rosterColumns$.value

   // rearrange the columns according to the move/event
    moveItemInArray(newColumns, event.previousIndex, event.currentIndex)

    // push new order into columns definition observable
    this.rosterColumns$.next([...newColumns]);
  }
}
