import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { PageHeaderComponent } from '@shared';
import { FlexiApplication } from 'app/routes/settings/employee-posting/interfaces';
import { FlexiService } from '../flexi.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-flexi-approve',
  templateUrl: './approve.component.html',
  styleUrl: './approve.component.css',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
})
export class FlexiApproveComponent implements OnInit {


dataSource = new MatTableDataSource<FlexiApplication>();

displayedColumns: string[] = ['flexi_current', 'flexi_to', 'wef', 'created_at','status', 'action'];
@ViewChild(MatPaginator) paginator: MatPaginator;

constructor(
  private flexiService: FlexiService,
  private router: Router,
  private route: ActivatedRoute,

)
{
}

  ngOnInit() {

    this.flexiService.getFlexiApplicationsForApproval()
    .pipe(
      map((data) => data.data)
    )
    .subscribe((data) => {
      console.log(data);

      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  approveApplication(arg0: any) {
    throw new Error('Method not implemented.');
    }
}
