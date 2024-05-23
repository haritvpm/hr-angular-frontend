import { Leave } from '../employee/interface';

export interface AttendanceBook{

  id: number;
  section_id: number;
  title: string;
}

export interface MonthlyPunching {
  employee_id: number;
  name: string;
  start_date: string | null;
  end_date: string | null;
  aadhaarid: string;
  attendance_book_id: number | null;
  attendance_book: AttendanceBook | null;
  section_id: number;
  section_name: string | null;
  works_nights_during_session: number;
  seat_of_controlling_officer_id: number;
  logged_in_user_is_controller: boolean;
  logged_in_user_is_section_officer: boolean;
  designation: string;
  designation_sortindex: number | null;
  default_time_group_id: number | null;
  seniority: number;
  total_grace_sec : number | null;
  total_extra_sec : number | null;
  total_grace_str : string | null;
  total_extra_str : string | null;
  total_grace_exceeded300_date : string | null;
  grace_limit : number;
  grace_left : number;
  extraMin: number;
  day1: PunchingInfo ;
  day2: PunchingInfo ;
  day3: PunchingInfo ;
  day4: PunchingInfo ;
  day5: PunchingInfo ;
  day6: PunchingInfo ;
  day7: PunchingInfo ;
  day8: PunchingInfo ;
  day9: PunchingInfo ;
  day10: PunchingInfo ;
  day11: PunchingInfo ;
  day12: PunchingInfo ;
  day13: PunchingInfo ;
  day14: PunchingInfo ;
  day15: PunchingInfo ;
  day16: PunchingInfo ;
  day17: PunchingInfo ;
  day18: PunchingInfo ;
  day19: PunchingInfo ;
  day20: PunchingInfo ;
  day21: PunchingInfo ;
  day22: PunchingInfo ;
  day23: PunchingInfo ;
  day24: PunchingInfo ;
  day25: PunchingInfo ;
  day26: PunchingInfo ;
  day27: PunchingInfo ;
  day28: PunchingInfo ;
  day29?: PunchingInfo  | null;
  day30?: PunchingInfo  | null;
  day31?: PunchingInfo  | null;
}

export interface PunchingInfo  {
  punching_count: number;
  id: number;
  date: string;
  aadhaarid: string;
  name: string;
  designation: string;
  section: string | null;
  in_section : boolean;
  in_time: string | null;
  out_time: string | null;
  in_datetime: string | null;
  out_datetime: string | null;
  duration_sec: number;
  grace_sec: number;
  extra_sec: number;
  duration_str: string;
  grace_str: string;
  extra_str: string;
  remarks: string | null;
  finalized_by_controller: number; // You may want to specify a more specific type here
  ot_sitting_sec: number | null;
  ot_nonsitting_sec: number | null;
  hint: any; // You may want to specify a more specific type here
  computer_hint : string;
  controller_set_punch_in: any; // You may want to specify a more specific type here
  controller_set_punch_out: any; // You may want to specify a more specific type here
  grace_total_exceeded_one_hour: number;
  created_at: string;
  updated_at: string;
  employee_id: number;
  punchin_trace_id: number | null;
  punchout_trace_id: number | null;
  leave_id: number | null;
  leave?: Leave;
  grace_exceeded300_and_today_has_grace : boolean;
  cl_marked: number;
  cl_submitted: number;
  compen_marked: number;
  compen_submitted: number;
  time_group: string;
  single_punch_type: string;
  single_punch_regularised_by: string;
  start_with_cl : number
  start_with_compen : number
  is_unauthorised : boolean;
}



// export interface Leave {
//   id: number;
//   aadhaarid: string;
//   employee_id: number;
//   leave_type: string;
//   start_date: string;
//   end_date: string;
//   reason: string;
//   active_status: string;
//   leave_cat: string;
//   time_period: string;
//   in_lieu_of: string;
//   last_updated: string;
//   creation_date: string;
//   created_by_aadhaarid: string;

// }

export interface MonthlyApiData {
  month: string;
  monthlypunchings: MonthlyPunching[];
  sections : string[];
  calender_info: { [key: string]: CalInfo }; // You may want to specify a more specific type here
}
export interface Month {
  month : number;
  year: number;
  // empDet:EmployeeAttendance[];
  }
  interface CalInfo {
    attendance_trace_fetch_complete: number;
    day: string;
    future_date: boolean;
    holiday: boolean;
    is_today: boolean;
    office_ends_at: string;
    rh: boolean;
    dayofweek: string;
}
