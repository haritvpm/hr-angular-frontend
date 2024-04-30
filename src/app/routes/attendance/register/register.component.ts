import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule, MatDatepickerInputEvent, MatDatepicker } from '@angular/material/datepicker';
import { RegisterService } from './register.service';
import { DailyPunching } from './interface';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-mattable-mattableapi',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [MatTableModule, RouterLink,
    MatPaginatorModule,
    MatSortModule, CommonModule, MatInputModule,
    MatDatepickerModule, MatIconModule, MatBadgeModule,
    FormsModule, ReactiveFormsModule, NgIf,
    MatTooltipModule, MatSelectModule]
})

export class AttendanceRegisterComponent implements OnInit {
  displayedColumns: string[] = ['name', 'section', 'inTrace', 'outTrace', 'duration_str', 'extra_str',
    'total_extra_sec', 'grace_str', 'total_grace_sec'];
  dataSource = new MatTableDataSource<DailyPunching>();
  data: DailyPunching[] = [];
  is_future: boolean;
  is_today: boolean;
  date_dmY: string;
  selectedDateHint: string = moment().format('DD MMMM YYYY');
  date = new FormControl(moment());

  //today's date
  todayDate: Date = new Date();
  beginDate: Date = new Date('2024-01-01');
  sections: string[] = [];
  public selectedSection = 'All';
  public searchTxt = '';
  public searchForm: FormGroup;


  // Define an array to hold the combined data
  combinedData: { name: string, designation: string }[] = [];


  constructor(private registerService: RegisterService, private _liveAnnouncer: LiveAnnouncer) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('picker') picker: MatDatepicker<Date>;


  ngOnInit() {

    this.fetchData(null);
    this.searchForm = new FormGroup({
      searchTxt: new FormControl(''),
      selectedSection: new FormControl('')
    });


  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // applyFilter(filterValue: string) {

  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
  applyFilter(){

    const searchTxt = this.searchForm.get('searchTxt')?.value;
    let section = this.searchForm.get('selectedSection')?.value;

    this.searchTxt = searchTxt === null ? '' : searchTxt;
    this.selectedSection = section === null ? '' : section;

    if (section === 'All') section = '';

    // console.log('t'+searchTxt);
    // console.log('s'+section);

    this.dataSource.filter = searchTxt.toLowerCase() + '$' + section.toLowerCase();
  }

  fetchData(date: string | null) {
    this.registerService.fetchData(date).subscribe((data) => {
      this.data = data.punchings;
      this.is_future = data.is_future;
      this.is_today = data.is_today;
      this.date_dmY = data.date_dmY;
      // this.selectedDate = moment(this.selectedDate).format('DD MMMM YYYY');
      console.log(data);
      // console.log(this.data);
      this.sections = data.sections ? ['All', ...data.sections] : ['All'];
      this.dataSource.data = this.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = this.getFilterPredicate();
      this.applyFilter();
      // this.searchFormInit();


    });

  }
  // searchFormInit() {
  //   this.searchForm = new FormGroup({
  //     searchTxt: new FormControl(''),
  //     selectedSection: new FormControl('')
  //   });
  // }
  getFilterPredicate() {
    return (row: DailyPunching, filters: string) => {

      // split string per '$' to array
      const filterArray = filters.split('$');
      const searchTxt = filterArray[0];
      const section = filterArray[1].replace('/', '');
      // console.log('searchTxt'+searchTxt);
      const matchFilter = [];

      // Fetch data from row
      const columnName = row.aadhaarid + row.name + row.designation;
      const columnSection = row?.section|| '';
      const attendance_book = row.attendance_book?.title || '';
      // console.log('section'+section+';');
      // console.log('columnSection'+columnSection+';');

      // verify fetching data by our searching values

      const customFilterN = columnName.toLowerCase().includes(searchTxt);
      const customFilterS = columnSection.toLowerCase() == section || section == '' || section == 'All' || attendance_book.toLowerCase().includes(section);

      // push boolean values into array
      matchFilter.push(customFilterN);
      matchFilter.push(customFilterS);

      // return true if all values in array is true
      // else return false
      return matchFilter.every(Boolean);
    };
  }


  dateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    if (event.value !== null && event.value !== undefined) {
      // const formattedDate = event.value.toISOString().substring(0,10); // Or use any other format method
      const formattedDate = new Date(event.value).toLocaleDateString('pt-br').split('/').reverse().join('-');
      const newdate = new Date(event.value);
      this.selectedDateHint = moment(newdate).format('DD MMMM YYYY');
      // console.log(formattedDate);
      this.fetchData(formattedDate);
    } else {
      // Handle the case where event.value is undefined
      console.log('Datepicker value is undefined');
    }
  }
  roundValue(value: number): number {
    return Math.round(value);
  }

  getGraceStyleTotal(employee: any) {
    const exeeded = this.roundValue(employee.total_grace_sec / 60) > 300;
    return {
      // 'background-color':exeeded ? 'yellow':'',
      'font-weight': exeeded ? 'bold' : '',
      'color': exeeded ? 'red' : ''
    };
  }

  getExtratimeColor(employee: any) {
    const extraTimeexeed = this.roundValue(employee.total_extra_sec / 60) > 600;
    return {
      'font-weight': extraTimeexeed ? 'bold' : '',
      'color': extraTimeexeed ? 'green' : ''
    };
  }
  getGraceStyle(employee: any) {
    if ((employee.total_grace_sec / 60) < 0) return {
      'color': 'red',
      'font-weight': 'bold'
    };
    if ((employee.total_grace_sec / 60) < 30) return {
      'color': 'orange',
      'font-weight': 'bold'

    };
    if (employee.total_grace_sec / 60 < 60) return {
      'color': ' darkblue',
      'font-weight': 'bold'
    };
    else
      return {
        'color': 'red',
        'font-weight': 'bold'
      };
  }
  getDurationColour(employee: any) {
    if (employee.punching_count < 2 && this.is_today === false) return {
      'color': 'red',
      'text-align': 'center',

    };
    if(employee.punching_count < 2 && this.is_today === true)
    return {
      'color': 'black',
      'font-weight': 'bold',
      'text-align': 'center',
      'font-size': 'large'

    };else{
      return {};
    }

  }

  getTooltipContent(employee: any): string {
    let tooltipContent = employee.name + '\n';
    if (employee.punching_count === 0) {
      tooltipContent += '\n"No Punching"';
    } else if (employee.punching_count < 2) {
      tooltipContent += '\n"Missing Punch Out"';
    }
    return tooltipContent;
  }
}


