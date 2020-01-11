import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  private teams: { sport: string; name: string }[] = [
    { sport: 'hockey', name: 'Pittsburgh Penguins' },
    { sport: 'hockey', name: 'Colorado Avalanche' },
    { sport: 'basketball', name: 'Boston Celtics' },
    { sport: 'basketball', name: 'Los Angeles Lakers' },
    { sport: 'baseball', name: 'Toronto Blue Jays' },
    { sport: 'baseball', name: 'New York Yankees' },
    { sport: 'football', name: 'Oakland Raiders' },
    { sport: 'football', name: 'Green Bay Packers' },
  ];

  private get sports(): string[] {
    return Array.from(this.teams.reduce((set, t) => {
      set.add(t.sport);
      return set;
    }, new Set<string>()));
  }

  private get teamNames(): string[] {
    return this.teams.map(t => t.name);
  }

  private unusedSports: string[] = this.sports;

  private teamChoices(sport: string) {
    return this.teams
      .filter(t => t.sport === sport)
      .map(t => t.name);
  }

  private form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {

    this.form = this.formBuilder.group({
      favorites: this.formBuilder.array([

        this.formBuilder.group({
          sport: 'hockey',
          // sportChoices: [
          //   { name: 'baseball', displayName: 'Baseball' },
          //   { name: 'football', displayName: 'Football' }
          // ],
          team: 'Pittsburgh Penguins',
          // teamChoices: [
          //   'Pittsburgh Penguins',
          //   'Colorado Avalanche'
          // ]
        }),

        this.formBuilder.group({
          sport: 'basketball',
          // sportChoices: [
          //   { name: 'baseball', displayName: 'Baseball' },
          //   { name: 'football', displayName: 'Football' }
          // ],
          team: 'Boston Celtics',
          // teamChoices: [
          //   'Boston Celtics',
          //   'Los Angeles Lakers'
          // ]
        })

      ])
    });
  }

  private log(msg: any) {
    console.log(msg);
  }
}
