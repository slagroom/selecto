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

  private sportDisplayName(sport: string) {
    if (sport === 'hockey') {
      return 'Hockey';
    }
    if (sport === 'basketball') {
      return 'Basketball';
    }
    if (sport === 'baseball') {
      return 'Baseball';
    }
    if (sport === 'football') {
      return 'Football';
    }
    return sport;
  }

  private get sports(): { name: string; displayName: string }[] {
    return Array.from(this.teams.map(t => t.sport)
      .reduce((set, sport) => {
        set.add(sport);
        return set;
      }, new Set<string>()))
      .map(sport => {
        return {
          name: sport,
          displayName: this.sportDisplayName(sport)
        }
      });
  }

  private initialFavorites: string[] = [
    'Pittsburgh Penguins',
    'Boston Celtics'
  ];

  private form: FormGroup;
  private favorites: FormArray;

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

    this.favorites = this.form.get('favorites') as FormArray;

    this.favorites.valueChanges.subscribe(this.onFormChanges);
  }
      
  private onFormChanges = favorites => {

    const usedSports = this.favorites.value
      .map(f => f.sport)
      .filter(f => f !== null);

    if (favorites[favorites.length - 1].sport !== null) {
      const empty = { sport: null, team: null, sportChoices: [], teamChoices: [] };
      this.favorites.push(this.formBuilder.group(empty));
      return;
    };

    this.favorites.controls.forEach(fg => {

      let favorite = fg.value;
      const sport = favorite.sport;

      favorite.sportChoices = this.sports
        .filter(s => s.name === sport || !usedSports.includes(s.name));

      favorite.teamChoices = this.teams
        .filter(t => t.sport === sport)
        .map(t => t.name);

      if (!favorite.teamChoices.includes(favorite.team)) {
        favorite.team = '';
      }
      
      fg.setValue(favorite, { emitEvent: false });
      
      if (favorite.sport === null) {
        fg.get('team').disable({ emitEvent: false });
      } else {
        fg.get('team').enable({ emitEvent: false });
      }
    });
  }
}
