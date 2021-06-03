import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

//Models
import { PlayerData, Player, Roster } from '../models/player.model';

//Services
import { PlayersService } from '../services/players.service';

//Directive
import {
  SortableHeader,
  SortEvent
} from '../directives/table-sorting.directive';

// compare func for sorting
export const compare = (v1: string, v2: string) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Component({
  selector: 'roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent {
  players: Player[];
  displayRoster: Player[];
  sourceRoster: Player[];
  rosterColumns: string[] = [
    'name',
    'position',
    'paid',
    'email',
    'address',
    'notes'
  ];
  @ViewChildren(SortableHeader) headers: QueryList<SortableHeader>;

  constructor(private playerService: PlayersService) {}

  ngOnInit() {
    this.playerService.getCurrentRoster().subscribe((result: Roster) => {
      this.players = result.records;
      this.sourceRoster = this.players;
      this.displayRoster = this.sourceRoster;
    });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '' || column === '') {
      this.displayRoster = this.sourceRoster;
    } else {
      this.displayRoster = [...this.sourceRoster].sort((a, b) => {
        const colValA = column.split('.').reduce((o, i) => o[i], a); // takes the column in dot notation and retrieves value for the obj passed in as the last argument in the reduce function
        const colValB = column.split('.').reduce((o, i) => o[i], b);
        const res = compare(`${colValA}`, `${colValB}`);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
