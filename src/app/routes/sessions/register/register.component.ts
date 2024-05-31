import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '@core/authentication';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    JsonPipe
  ],
})
export class RegisterComponent implements OnInit{
  isSubmitting = false;

  noWhitespaceValidator(control: FormControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  registerForm = this.fb.nonNullable.group(
    {
      aadhaarid: ['', [this.noWhitespaceValidator, Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(8), Validators.maxLength(12)]],
      pen: ['', [this.noWhitespaceValidator, Validators.required, Validators.minLength(6), Validators.maxLength(7)]],
      username: ['', [Validators.required, this.noWhitespaceValidator, Validators.minLength(6), Validators.maxLength(20)]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [this.matchValidator('password', 'confirmPassword')],
    }
  );

  constructor(private fb: FormBuilder,
    private loginService: LoginService,  private toastr: ToastrService,   private router: Router, ) {}

  matchValidator(source: string, target: string) {
    return (control: AbstractControl) => {
      const sourceControl = control.get(source)!;
      const targetControl = control.get(target)!;
      if (targetControl.errors && !targetControl.errors.mismatch) {
        return null;
      }
      if (sourceControl.value !== targetControl.value) {
        targetControl.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        targetControl.setErrors(null);
        return null;
      }
    };
  }

  ngOnInit(): void {

  //  this.registerForm
  }

  register() {

    if (this.registerForm.invalid) {
      return;
    }


    this.isSubmitting = true;

    this.loginService
      .register(this.registerForm.value)
      .pipe(
        finalize(() => this.isSubmitting = false),
      )
      .subscribe({
        next: () => {
          this.toastr.info(`User created successfully. Please login`);

          this.router.navigateByUrl('/auth/login');
        },
        error: (errorRes: HttpErrorResponse) => {
          if (errorRes.status === 422 ) {
            const form = this.registerForm;
            const errors = errorRes.error.errors;
            Object.keys(errors).forEach(key => {
              form.get(key === 'username' ? 'username' : key)?.setErrors({
                remote: errors[key][0],
              });
            });
          } else {
            this.toastr.error(`Invalid username or password (status: ${errorRes.status})`);
          }
          this.isSubmitting = false;
        },
      });
  }

}
