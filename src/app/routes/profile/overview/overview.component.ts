import { Component, OnInit, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { IProfile } from '@shared';
import { LoginService } from '@core/authentication';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatTabsModule],
})
export class ProfileOverviewComponent  implements OnInit{

  profile : IProfile | null = null;
  private readonly loginService = inject(LoginService);

  ngOnInit() {
    this.loginService.getProfile().subscribe((profile) => {
      this.profile = profile;
    });
  }

}
