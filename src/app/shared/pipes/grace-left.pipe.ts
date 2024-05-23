import { Pipe, PipeTransform } from '@angular/core';
import { MonthlyPunching } from 'app/routes/attendance/monthwise-section/interfaces';

@Pipe({
  name: 'graceLeft',
  standalone: true
})
export class GraceLeftPipe implements PipeTransform {

  transform(value: MonthlyPunching): number {
    const grace = value?.total_grace_sec || 0;
    const grace_limit = value?.grace_limit || 300;
    console.log('grace_limit:', grace_limit);
    return Math.ceil(grace_limit - grace / 60);
  }
}
