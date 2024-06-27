import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexiApplication } from 'app/routes/settings/employee-posting/interfaces';
import { EmployeePostingService } from 'app/routes/settings/employee-posting/employee-posting.service';
import { FlexiService } from '../flexi.service';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-flexi-application-list',
    standalone: true,
    templateUrl: './flexi-application-list.component.html',
    styleUrl: './flexi-application-list.component.css',
    imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, BreadcrumbComponent]
})
export class FlexiApplicationListComponent implements OnInit{

  dataSource = new MatTableDataSource<FlexiApplication>();

  displayedColumns: string[] = ['fleximinutes', 'wef', 'created_at', 'owner' , 'status', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private flexiService: FlexiService,
    private router: Router,
    private route: ActivatedRoute,

  )
  {
  }

  loadData() {
    this.flexiService.getFlexiApplications().subscribe((data) => {
      console.log(data);

      this.dataSource.data = data.flexi_applications;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit(): void {
    this.loadData();

  }

  deleteApplication(id: number) {
    this.flexiService.deleteUserFlexiSetting(id).subscribe((data: any) => {
      console.log(data);
      this.loadData();
    });
  }
}
