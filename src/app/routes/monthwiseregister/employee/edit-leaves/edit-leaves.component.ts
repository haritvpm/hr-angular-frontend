import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButton, MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-edit-leaves',
  standalone: true,
  imports: [ ReactiveFormsModule, MatError,MatFormFieldModule, MatInputModule, 
    MatGridListModule, MatCardModule,  MatFormFieldModule, 
    MatFormField, MatInput,MatButtonModule,MatDialogActions,     
    MatButton,
    MatDialogClose,],
  templateUrl: './edit-leaves.component.html',
  styleUrl: './edit-leaves.component.css'
})
export class EditLeavesComponent implements OnInit {
  
  public form: FormGroup;
  wasFormChanged = false;
  // public breakpoint: number; // Breakpoint observer code
 // public cl_start: number = 0;
 // public compen_start: number = 0;

  constructor(
    private fb: FormBuilder, 
    public dialogRef: MatDialogRef<EditLeavesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  public ngOnInit(): void {
    this.form = this.fb.group({
      
      start_with_cl: [this.data.cl_start, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.max(20)]],
      start_with_compen: [this.data.compen_start, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.max(15)]],
    });

    // this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code

  }

  onFormSubmit() {
    if (this.form.valid) {
      //this.dialog.closeAll();
    }
  }
  onFormClose() {
    this.dialogRef.close();
  }
 // tslint:disable-next-line:no-any
//  public onResize(event: any): void {
//   this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
// }
  formChanged() {
    this.wasFormChanged = true;
  }
}
