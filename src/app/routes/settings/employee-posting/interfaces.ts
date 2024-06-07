export interface Employee {
  id: number; //emp - section_id
  employee_id: number;
  name: string;
  start_date: string;
  end_date: string | null;
  aadhaarid: string;
  attendance_book_id: number | null;
  attendance_book: AttendanceBook | null;
  section_id: number;
  section_name: string;
  seat_of_controlling_officer_id: number;
  logged_in_user_is_controller: boolean;
  logged_in_user_is_section_officer: boolean;
  designation: string;
  designation_sortindex: number | null;
  time_group: string;
  seniority: number | null;
  last_posting_end_date: string;
  flexi_minutes_current: number;
  flexi_time_wef_current: string;
  flexi_minutes_upcoming: number;
  flexi_time_wef_upcoming: string;
}

export interface Section {
  id: number;
  name: string;
  short_code: string | null;
  type: string | null;
  works_nights_during_session: number;
  created_at: string | null;
  updated_at: string;
  seat_of_controlling_officer_id: number;
  office_location_id: number;
  seat_of_reporting_officer_id: number;
  js_as_ss_employee_id: number;
  section_attendance_books: AttendanceBook[];
}

export interface AttendanceBook {
  id: number;
  title: string;
  section_id: number;
}

export interface OfficeTime {
  id: number;
  groupname: string;
  description: string | null;
  fn_from: string;
  fn_to: string;
  an_from: string;
  an_to: string;
  flexi_minutes: number;
  with_effect_from: string;
}

export interface MySectionEmployees {
  employees_under_my_section: Employee[];
  sections: Section[];
  attendancebooks: AttendanceBook[];
  officeTimes : OfficeTime[];
}


export interface UserFlexiSetting{
  //name: string;
  //aadhaarid : string;
  //timeOptions: string[];
  flexi_time_wef_upcoming : string;
  flexi_minutes_upcoming : number;
  flexi_time_wef_current : string;
  flexi_minutes_current : number;
  //canChangeFlexi : boolean;
  time_group : string;
}

export interface Seat {
  seat_id : number;
  seat_name : string;
  employee_name : string;
}
export interface FlexiApplication {
  employee_id : number;
  aadhaarid : string;
  flexi_minutes : number;
  with_effect_from : string;
  owner_seat : number;
  approved_by : string;
  approved_on : string;
  created_at : string;
}


export interface UserFlexiSettingApi {
  officeTimes : any;
  employee_setting : UserFlexiSetting;
  forwardable_seats : Seat[];
  prev_flexi_applications : FlexiApplication[];
}
