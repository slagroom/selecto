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

  private initialFavorites: string[] = [
    'Pittsburgh Penguins',
    'Boston Celtics'
  ];

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

  private form: FormGroup;
  private favorites: FormArray;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {

    this.form = this.formBuilder.group({
      favorites: this.formBuilder.array(
        this.initialFavorites.map(team => this.formBuilder.group({
          sport: this.getSport(team),
          team,
          sportChoices: this.formBuilder.control([]),
          teamChoices: this.formBuilder.control([])
        })))
    });

    this.favorites = this.form.get('favorites') as FormArray;
    this.favorites.valueChanges.subscribe(this.onFormChanges);
    this.onFormChanges(this.favorites.value);
  }
      
  private onFormChanges = favorites => {

    const usedSports = this.favorites.value.map(f => f.sport).filter(f => f !== null);

    if (favorites.length === 0 || favorites[favorites.length - 1].sport !== null) {
      const empty = { sport: null, team: null, sportChoices: [], teamChoices: [] };
      this.favorites.push(this.formBuilder.group(empty));
      return;
    };

    this.favorites.controls.forEach(fg => {

      let favorite = fg.value;
      const sport = favorite.sport;

      favorite.sportChoices = this.sports
        .filter(s => s.name === sport || !usedSports.includes(s.name));

      favorite.teamChoices = this.teams.filter(t => t.sport === sport).map(t => t.name);

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

  private getSport(team: string) {
    const match = this.teams.filter(t => t.name === team)[0];
    if (match) {
      return match.sport;
    }
    return 'unknown';
  }
}
