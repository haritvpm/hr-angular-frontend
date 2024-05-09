import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { LoginService } from '@core/authentication/login.service';
import { MatButtonLoading } from '@ng-matero/extensions/button';
import { ControlsOf, IProfile } from '@shared';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonLoading,
  ],
})
export class ProfileSettingsComponent implements OnInit{
  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  profile : IProfile | null = null;

  reactiveForm = this.fb.nonNullable.group({
    name: ['', []],
    name_mal: ['', []],
    email: ['', [ Validators.email]],
    srismt: ['', []],
    //city: ['', []],
    address: ['', []],
    // : ['', []],
    mobile: ['', []],
    klaid: ['', []],
    pan: ['', []],
    dateOfJoinInKLA: ['', []],
  });

  isLoading = false;

  ngOnInit() {
    this.loginService.getProfile().subscribe((profile) => {
      this.profile = profile;
      this.reactiveForm.patchValue(profile);
      this.isLoading = false;
    });
  }

  getErrorMessage(form: FormGroup<ControlsOf<IProfile>>) {
    return form.get('email')?.hasError('required')
      ? 'You must enter a value'
      : form.get('email')?.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  onSubmit() {
    if (this.reactiveForm.valid) {
      this.isLoading = true;
      this.loginService.updateProfile(this.reactiveForm.value).subscribe(
        () => {
          this.isLoading = false;

          this.router.navigate (['/profile']);

        },
        (error) => {
          this.isLoading = false;
          console.error('Error updating profile', error);
        }
      );
    }
  }
}
