import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexiApplication } from 'app/routes/settings/employee-posting/interfaces';
import { EmployeePostingService } from 'app/routes/settings/employee-posting/employee-posting.service';

@Component({
  selector: 'app-flexi-application-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
  templateUrl: './flexi-application-list.component.html',
  styleUrl: './flexi-application-list.component.css'
})
export class FlexiApplicationListComponent implements OnInit{

  dataSource = new MatTableDataSource<FlexiApplication>();

  displayedColumns: string[] = ['fleximinutes', 'wef', 'created_at','status', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    private employeeService: EmployeePostingService,
    private router: Router,
    private route: ActivatedRoute,

  )
  {
  }  

  ngOnInit(): void {
    this.employeeService.getFlexiApplications().subscribe((data) => {
      console.log(data);
      this.dataSource.data = data.flexi_applications;
    });
    
  }

  deleteApplication(_t56: any) {
    throw new Error('Method not implemented.');
    }
}
