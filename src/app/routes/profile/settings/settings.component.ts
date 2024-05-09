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
import { LoginService } from '@core/authentication/login.service';

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
  ],
})
export class ProfileSettingsComponent implements OnInit{
  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  profile : IProfile | null = null;

  reactiveForm = this.fb.nonNullable.group({
    name: ['', []],
    name_mal: ['', []],
    email: ['', [ Validators.email]],
    gender: ['', []],
    //city: ['', []],
    address: ['', []],
    // company: ['', []],
    mobile: ['', []],
    // tele: ['', []],
    // website: ['', []],
    dateOfJoinInKLA: ['', []],
  });

  constructor() {

  }
  ngOnInit() {
    this.loginService.getProfile().subscribe((profile) => {
      this.profile = profile;
      this.reactiveForm.patchValue(profile);
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
      this.loginService.updateProfile(this.reactiveForm.value).subscribe();
    }
  }
}
