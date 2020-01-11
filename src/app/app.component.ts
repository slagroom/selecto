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

  private unusedSports: string[] = [ 'baseball', 'football' ];

  private teamChoices(sport: string) {
    console.log('team choices for: ' + sport);
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
          team: 'Pittsburgh Penguins',
          sportChoices: this.formBuilder.control([
            { name: 'hockey', displayName: 'Hockey' },
            { name: 'baseball', displayName: 'Baseball' },
            { name: 'football', displayName: 'Football' }
          ]),
          teamChoices: this.formBuilder.control([
            'Pittsburgh Penguins',
            'Colorado Avalanche'
          ])
        }),

        this.formBuilder.group({
          sport: 'basketball',
          team: 'Boston Celtics',
          sportChoices: this.formBuilder.control([
            { name: 'basketball', displayName: 'Basketball' },
            { name: 'baseball', displayName: 'Baseball' },
            { name: 'football', displayName: 'Football' }
          ]),
          teamChoices: this.formBuilder.control([
            'Boston Celtics',
            'Los Angeles Lakers'
          ])
        })

      ])
    });
  }

  private log(msg: any) {
    console.log(msg);
  }
}
