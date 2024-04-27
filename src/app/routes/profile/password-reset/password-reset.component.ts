import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {


  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  registerForm = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    {
      validators: [this.matchValidator('password', 'confirmPassword')],
    }
  );
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


  validateForm() {

    this.registerForm.controls.password.markAsTouched();

  }

  onSubmit(form: any): void {
    console.log(form);
    if (this.registerForm.valid) {

      this.loginService.resetPassword(form)
      .pipe(
        catchError( (_err) =>  {
          console.log(_err); return of(null);
        })
      )
      .subscribe(
        res => {
          console.log('Data Post Done');
          //navigate to 'overview'
          if(res){this.router.navigate(['./../overview']);}
        }
      );

    }
    else { this.validateForm(); }
  }

}
