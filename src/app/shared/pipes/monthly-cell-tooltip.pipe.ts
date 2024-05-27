import { Pipe, PipeTransform } from '@angular/core';
import { PunchingInfo } from 'app/routes/attendance/monthwise-section/interfaces';

@Pipe({
  name: 'monthlyCellTooltip',
  standalone: true
})
export class MonthlyCellTooltipPipe implements PipeTransform {

  transform(rowVal: PunchingInfo): string {
   // const rowVal = row[dayN];
    let tip = rowVal.name + '\n';
    const hint = rowVal.hint ? rowVal.hint : rowVal.computer_hint ? rowVal.computer_hint + '?' : '';

    if (hint) {
    //  hint = leaveList.find((x: any) => x.value == hint)?.label || '';
    }

    if (!rowVal?.leave_id && rowVal?.is_unauthorised) tip += 'Unauthorised\n';
    else if (hint)  tip += hint || 'No Punching. \n';


    tip += (rowVal?.flexi_time || '') + '\n' ;


    if (rowVal?.punching_count >= 1) {
      tip += rowVal?.in_time + '-' + rowVal?.out_time + '\n' + hint;
      if (rowVal.grace_sec) {
        tip += '\n Grace (min): ' + rowVal?.grace_str || 0;
        if (rowVal.grace_sec > 3600) tip += ' ( > 60 min)';
        if (rowVal.grace_exceeded300_and_today_has_grace) tip += '\n Grace > 300 min';
        //tip += '\n Grace exceeded by (min) : ' + Math.round(rowVal?.grace_total_exceeded_one_hour/60) ;
      }
      if (rowVal.extra_sec) {
       tip += '\n Extra (min): ' + rowVal?.extra_str || 0;
      }


    }
    return tip;
  }

}
