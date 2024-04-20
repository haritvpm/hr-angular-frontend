import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule, MatDatepickerInputEvent, MatDatepicker } from '@angular/material/datepicker';
import { RegisterService } from './register.service';
import { dateWise } from './interface';
import { MatIcon } from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';

@Component({
  selector: 'app-mattable-mattableapi',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [MatTableModule,
    MatPaginatorModule,
    MatSortModule, MatInputModule,
    MatDatepickerModule, MatIcon, MatBadgeModule]
})

export class AttendanceRegisterComponent implements OnInit {
  displayedColumns: string[] = ['aadhaarid', 'name',
  'section', 'inTrace','outTrace', 'duration_str', 'extra_str',
   'total_extra_sec','grace_str', 'total_grace_sec'];
  dataSource = new MatTableDataSource<dateWise>();
  data: dateWise[] = [];
  is_future: boolean;
  is_today:boolean;
  date_dmY: string;


   // Define an array to hold the combined data
combinedData: { name: string, designation: string }[] = [];


  constructor(private registerService: RegisterService, private _liveAnnouncer: LiveAnnouncer) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('picker') picker: MatDatepicker<Date>;


  ngOnInit() {
    const currentDate = new Date();
    // this.picker.select(currentDate);
    // this.dateChanged('change', { target: this.picker, targetElement: null, value: currentDate });
    this.fetchData(null);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fetchData(date: string | null) {
    // const url = date?'/api/v1/punchings/' + date : '/api/v1/punchings/';
    // this.httpClient.get<dateWiseApi>(url).subscribe((data) => {
    this.registerService.fetchData(date).subscribe((data) => {
      this.data = data.punchings;
      this.is_future = data.is_future;
      this.is_today = data.is_today;
      this.date_dmY = data.date_dmY;
      console.log(data);
      // console.log(this.data);
      this.dataSource.data = this.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });

  }

  dateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    if (event.value !== null && event.value !== undefined) {
      // const formattedDate = event.value.toISOString().substring(0,10); // Or use any other format method
      const formattedDate = new Date(event.value).toLocaleDateString('pt-br').split('/').reverse().join('-');
      console.log(formattedDate);
      this.fetchData(formattedDate);
    } else {
      // Handle the case where event.value is undefined
      console.log('Datepicker value is undefined');
    }
  }
  roundValue(value: number): number {
    return Math.round(value);
  }

  // graceExeeded(employee : any){
  //   return roundValue(employee.total_grace_sec/60)>30;
  // }
  getGraceColor(employee : any){
    return Math.round(employee.total_grace_sec/60)>300? 'red':'';
  }
  getGraceStyle(employee : any){
    const exeeded = this.roundValue(employee.total_grace_sec/60)>300;
    return {
      // 'background-color':exeeded ? 'yellow':'',
      'font-weight': exeeded? 'bold' : '',
      'color': exeeded? 'red': ''
    };
  }
  getExtratimeColor (employee : any){
    return Math.round(employee.total_extra_sec/60)>600?'green':'';
  }
  getTotalExtrStyle(employee : any){
    const totalextraexceed = this.roundValue(employee.total_extra_sec/60)>600;
    return {
      'font-weight' : totalextraexceed? 'bold' : '',
      'color' : totalextraexceed? 'red': ''
    };
  }

}
