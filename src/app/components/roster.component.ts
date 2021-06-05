import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject,combineLatest, Subscription } from 'rxjs';
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
  flatPlayers$ = new BehaviorSubject<FlatPlayer[]>([]);
  flatPlayersDisplay$ = new BehaviorSubject<FlatPlayer[]>([]);
  playerSub: Subscription;
  tableDataSub: Subscription;
  rosterColumns$ = new BehaviorSubject<string[]>([
    'id',
    'name',
    'position',
    'email',
    'address',
    'notes'
  ]);
  sortKey$ = new BehaviorSubject<string>('');
  sortDirection$ = new BehaviorSubject<string>('asc');
  searchControl = new FormControl();


  constructor(private playerService: PlayersService) {}

  ngOnInit() {
    this.playerSub = this.playerService.getCurrentRoster().subscribe((roster: Roster) => {
      const flat = Object.values(roster.records);
      this.flatPlayers$.next(flat.map(el => flattenObject(el)))
      this.flatPlayersDisplay$.next(this.flatPlayers$.value)
      console.log('flatplayers',this.flatPlayersDisplay$.value);

    });

    this.tableDataSub = combineLatest([this.flatPlayers$, this.sortKey$, this.sortDirection$, this.searchControl.valueChanges])
      .subscribe(([players, sortKey, sortDirection, searchInput]) => {
        console.log('inside combine', sortKey, sortDirection, players);

        //get current snapshot of the players
        const rosterArray = Object.values(players);

        //make new empty copy as placeholder
        let filteredRoster: FlatPlayer[] = [];

        if (!searchInput) {
          //no filter needed, assign current version to placeholder
          filteredRoster = rosterArray;
        } else {
          //need to filter on current snapshot
          const filteredResults = rosterArray.filter(hero => {
            return Object.values(hero)
              .reduce((prev, curr) => {
                return prev || curr.toString().toLowerCase().includes(searchInput.toLowerCase());
              }, false);
          });
          //assign filtered snapshot to the placeholder
          filteredRoster = filteredResults;
        }

        //sort on the placeholder that now has the filtered (or unfiltered) values
        const nextSort = filteredRoster.sort((a, b) => {
          console.log('inside .sort',a, b, a[sortKey], b[sortKey]);
          if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
          if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
          return 0;
        });

        console.log('nextsort',nextSort);

        //push sorted values into display observable
        this.flatPlayersDisplay$.next(nextSort);
      });

    // set value of search input so that .valueChanges has emitted at least once
    this.searchControl.setValue('');
  }

  sortColumn(key: string) {
    console.log('inside sortCol', this.sortKey$.value, this.sortDirection$.value,key);

    //swap/set direction based on prev direction and key
    if (this.sortKey$.value === key) {
      if (this.sortDirection$.value === 'asc') {
        this.sortDirection$.next('desc');
      } else {
        this.sortDirection$.next('asc');
      }
      return;
    }

    //push new vals in key and direction
    this.sortKey$.next(key);
    this.sortDirection$.next('asc');
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log('inside drop');
    //make a static array with the current columns
    const newColumns: string[] = this.rosterColumns$.value

   // rearrange the columns according to the drop location/event
    moveItemInArray(newColumns, event.previousIndex, event.currentIndex)

    // push new order into columns definition observable
    this.rosterColumns$.next([...newColumns]);
  }

  ngOnDestroy() {
    // unsubscribe
    this.playerSub.unsubscribe();
    this.tableDataSub.unsubscribe();
  }
}
