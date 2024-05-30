import { Routes } from '@angular/router';

import { ProfileLayoutComponent } from './layout/layout.component';
import { ProfileOverviewComponent } from './overview/overview.component';
import { ProfileSettingsComponent } from './settings/settings.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

export const routes: Routes = [
  {
    path: '',
    component: ProfileLayoutComponent,
    children: [
      { path: '', redirectTo: 'settings', pathMatch: 'full' },
      { path: 'overview', component: ProfileOverviewComponent },
      { path: 'settings', component: ProfileSettingsComponent },
      { path: 'password-reset', component: PasswordResetComponent },

    ],
  },
];
