import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import screenfull from 'screenfull';

import { BrandingComponent } from '../widgets/branding.component';
import { GithubButtonComponent } from '../widgets/github.component';
import { NotificationComponent } from '../widgets/notification.component';
import { TranslateComponent } from '../widgets/translate.component';
import { UserComponent } from '../widgets/user.component';
import { SettingsService } from '@core/bootstrap/settings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    BrandingComponent,
    GithubButtonComponent,
    NotificationComponent,
    TranslateComponent,
    UserComponent,
  ],
})
export class HeaderComponent{
  @HostBinding('class') class = 'matero-header';

  @Input() showToggle = true;
  @Input() showBranding = false;
 // options = this.settingsService.getOptions();

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleSidenavNotice = new EventEmitter<void>();


  constructor( private settingsService: SettingsService) {}
  
  // OnInit() {
  //  // this.options = this.settingsService.getOptions();
  // }
  toggleFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }

  toggleTheme(){

    let options = this.settingsService.getOptions();
    options.theme = this.settingsService.getThemeColor() === 'dark' ? 'light' : 'dark';
    this.settingsService.setOptions(options);
    this.settingsService.setTheme();
  }
}
