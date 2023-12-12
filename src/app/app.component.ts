import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Simple Courses';

  constructor(private primengConfig: PrimeNGConfig, private themeService: ThemeService) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  changeTheme(isDarkMode: boolean) {
    this.themeService.switchTheme(isDarkMode);
  }
}
