import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { SearchAttendanceService } from './search-attendance.service';

import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ViewFlexiEmployeesComponent } from './view-flexi-employees/view-flexi-employees.component';

interface FoodNode {
  index : number;
  aadhaarid: string;
  date?: string;
  name : string;
  section : string;
  designation : string;
  in_datetime ?: string;
  out_datetime ?: string;

  //punching_count? : number;
  grace_str : string;
  extra_str : string;
  is_unauthorised : boolean;
  flexi_time : string;
  /*single_punch_regularised_by? : string;
  grace_total_exceeded_one_hour? : string;*/
  children?: FoodNode[];
}
interface ExampleFlatNode {
  expandable: boolean;
  index : number;

  aadhaarid: string;
  date: string | undefined;
 // name : string;
  section : string;
  designation : string;
  in_datetime : string| undefined;
  out_datetime : string| undefined;

 // punching_count : number;
  grace_str : string;
  extra_str : string;
  is_unauthorised : boolean;
  flexi_time : string;
  /*single_punch_regularised_by : string;
  grace_total_exceeded_one_hour : string;*/
  level: number;
}



@Component({
    selector: 'app-search-attendance',
    standalone: true,
    templateUrl: './search-attendance.component.html',
    styleUrl: './search-attendance.component.css',
    imports: [MatTabsModule, MatTableModule, MatInputModule, MatCheckboxModule, MatButtonModule,
        MatIconModule, MatFormFieldModule, MatDatepickerModule,
        FormsModule, ReactiveFormsModule, JsonPipe, DatePipe,
        MatSelectModule, ViewFlexiEmployeesComponent]
})
export class SearchAttendanceComponent implements OnInit {

  today = new Date();

  form = new FormGroup({
    range: new FormGroup({
      start: new FormControl<Date | null>(null, Validators.required),
      end: new FormControl<Date | null>(null, Validators.required),
    }),
    aadhaarid: new FormControl<string>(''),
    single_punches: new FormControl<boolean>(false),
    one_hour_exceeded: new FormControl<boolean>(false),
    grace_exceeded: new FormControl<boolean>(false),
    unauthorized: new FormControl<boolean>(false),
    category :new FormControl<string>(''),
  });

  displayedColumns: string[] = ['#','aadhaarid',  'flexi_time', 'time', 'grace', 'extra'];

  private transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      index : node.index,

      aadhaarid: 0 == level ? node.aadhaarid : /*node.designation + ' ' +*/ (node.section || '') + node.date,
      date: node.date,
    //  name: node.name,
      section: node.section,
      in_datetime : node.in_datetime,
      out_datetime : node.out_datetime,
      designation : node.designation,

      //punching_count : node.punching_count,
      grace_str : node.grace_str,
      extra_str : node.extra_str,
      is_unauthorised : node.is_unauthorised,
      flexi_time : node.flexi_time,
     /* single_punch_regularised_by : node.single_punch_regularised_by,
      grace_total_exceeded_one_hour : node.grace_total_exceeded_one_hour,*/
      level,
    };
  };


  // treeControl = new FlatTreeControl<{ expandable: boolean; aadhaarid: string; date: string | undefined; level: number; }>(
  //   node => node.level, node => node.expandable);

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

    treeFlattener = new MatTreeFlattener(
      this.transformer, node => node.level,
      node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  atleastOneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const single_punches = control.get('single_punches');
    const one_hour_exceeded = control.get('one_hour_exceeded');
    const grace_exceeded = control.get('grace_exceeded');
    const unauthorized = control.get('unauthorized');
    if (single_punches && one_hour_exceeded && !single_punches.value && !one_hour_exceeded.value &&
      grace_exceeded && unauthorized && !grace_exceeded.value && !unauthorized.value) {
      return {
        altleastonecriteria: true
      };
    }
    return null;
  };

  constructor(private searchAttendanceService: SearchAttendanceService) { }

  ngOnInit(): void {
    this.form.setValidators(this.atleastOneValidator);
  }

  onSubmit() {
    console.log(this.form.value);
    this.searchAttendanceService.search(this.form.value).subscribe((res) => {
      console.log(res);
      this.dataSource.data = res;
    });

  }
}
