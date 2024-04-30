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
  total_grace_exceeded300_date : string | null;
  day1: PunchingInfo | PunchingDay;
  day2: PunchingInfo | PunchingDay;
  day3: PunchingInfo | PunchingDay;
  day4: PunchingInfo | PunchingDay;
  day5: PunchingInfo | PunchingDay;
  day6: PunchingInfo | PunchingDay;
  day7: PunchingInfo | PunchingDay;
  day8: PunchingInfo | PunchingDay;
  day9: PunchingInfo | PunchingDay;
  day10: PunchingInfo | PunchingDay;
  day11: PunchingInfo | PunchingDay;
  day12: PunchingInfo | PunchingDay;
  day13: PunchingInfo | PunchingDay;
  day14: PunchingInfo | PunchingDay;
  day15: PunchingInfo | PunchingDay;
  day16: PunchingInfo | PunchingDay;
  day17: PunchingInfo | PunchingDay;
  day18: PunchingInfo | PunchingDay;
  day19: PunchingInfo | PunchingDay;
  day20: PunchingInfo | PunchingDay;
  day21: PunchingInfo | PunchingDay;
  day22: PunchingInfo | PunchingDay;
  day23: PunchingInfo | PunchingDay;
  day24: PunchingInfo | PunchingDay;
  day25: PunchingInfo | PunchingDay;
  day26: PunchingInfo | PunchingDay;
  day27: PunchingInfo | PunchingDay;
  day28: PunchingInfo | PunchingDay | null;
  day29?: PunchingInfo | PunchingDay | null;
  day30?: PunchingInfo | PunchingDay | null;
  day31?: PunchingInfo | PunchingDay | null;
}

export interface PunchingDay {
  in_section: boolean;
}

export interface PunchingInfo extends PunchingDay {
  punching_count: number;
  id: number;
  date: string;
  aadhaarid: string;
  name: string;
  designation: string;
  section: string | null;
  in_section : boolean;
  in_datetime: string | null;
  out_datetime: string | null;
  duration_sec: number;
  grace_sec: number;
  extra_sec: number;
  duration_str: string;
  grace_str: string;
  extra_str: string;
  remarks: string | null;
  finalized_by_controller: any; // You may want to specify a more specific type here
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
  grace_exceeded300_and_today_has_grace : boolean;
}

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
}
