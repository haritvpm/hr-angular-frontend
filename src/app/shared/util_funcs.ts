import { OfficeTime } from 'app/routes/settings/employee-posting/interfaces';
import moment from 'moment';
export type TimeOption = {
  value:number;
  label : string;
}

export function getTimeOptionStringFromFlexiMinute(flexi_minutes: number,  time_group: string, officeTimes: OfficeTime[] ) {

  for(let i = 0; i < officeTimes.length; i++){
    if(officeTimes[i].groupname == time_group){
        const flexi = officeTimes[i].flexi_minutes;
        const from = moment( '2024-01-01 '+ officeTimes[i].fn_from); //parttime does not have an_from
        //remove seconds from 'from' and 'to'
        const to_str = officeTimes[i].an_to || officeTimes[i].fn_to; //parttime does not have an_to
        const to = moment('2024-01-01 '+ to_str);
        if(flexi_minutes == 0){
        return 'Normal (' + from.format('h:mm a') + ' - ' + to .format('h:mm a') + ')';
        }
        if(flexi_minutes < 0){
         return 'Flexi (' + from.add(-flexi,'minute').format('h:mm a') + ' - ' + to.add(-flexi,'minute').format('h:mm a') + ')';
        }
        return 'Flexi (' + from.add(flexi,'minute').format('h:mm a') + ' - ' + to.add(flexi,'minute').format('h:mm a') + ')';
    }
  }

 return '';

}

export function getTimeOptions(
  wef: string|null, current_flexi_minutes:number, time_group: string, officeTimes: OfficeTime[] ) : TimeOption[] {

  const timeOptions : TimeOption[] = [];

  if(wef){
    const selected = moment(wef);
    //find timegroup that is effective for the selected date
    for(let i = 0; i < officeTimes.length; i++){
      if(officeTimes[i].groupname == time_group){

        const difference =  moment(officeTimes[i].with_effect_from).diff( selected, 'days' );
//alert(difference);
        if( difference <= 0 ){

          const flexi = officeTimes[i].flexi_minutes;
          const from = moment( '2024-01-01 '+ officeTimes[i].fn_from); //parttime does not have an_from
          //remove seconds from 'from' and 'to'
          const to_str = officeTimes[i].an_to || officeTimes[i].fn_to; //parttime does not have an_to
          const to = moment('2024-01-01 '+ to_str);

          if(current_flexi_minutes !== 0){
          timeOptions.push( { value: 0, label: 'Normal (' + from.format('h:mm a') + ' - ' + to .format('h:mm a') + ')'});
          }
          if(current_flexi_minutes !==  -flexi){
          timeOptions.push( { value: -flexi, label: 'Flexi (' + from.add(-flexi,'minute').format('h:mm a') + ' - ' + to.add(-flexi,'minute').format('h:mm a') + ')'});
          }
          //not above operation modifies 'from' and 'to' so we need add twice the minutes
          if(current_flexi_minutes !==  flexi){
          timeOptions.push( { value: flexi, label: 'Flexi (' + from.add(flexi*2,'minute').format('h:mm a') + ' - ' + to.add(flexi*2,'minute').format('h:mm a') + ')'});
          }

          break;
        }
      }

    }
  }

  return timeOptions;
}

export function canChangeFlexiFunc(flexi_time_wef_current: string|null)
: {canChangeFlexi: boolean, lastChangedtext: string} {
  //flexi can be changed if flexi_time_last_updated is not this month OR IF flexi_time_last_updated is null.
  let canChangeFlexi = false;
  let lastChangedtext = 'never';

  if(flexi_time_wef_current){
    const lastUpdated = moment(flexi_time_wef_current);
    lastChangedtext = lastUpdated.format('DD MMM YYYY');
    const today = moment();
    const diff = today.diff(lastUpdated, 'days');
    canChangeFlexi = diff >= 25 && today.format('M') !== lastUpdated.format('M');
  }else{
    canChangeFlexi = true;
  }

  return {canChangeFlexi, lastChangedtext};

}
