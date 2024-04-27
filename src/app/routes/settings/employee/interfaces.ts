export interface Employee {
  id: number; //emp - section_id
  employee_id: number;
  name: string;
  start_date: string;
  end_date: string | null;
  aadhaarid: string;
  attendance_book_id: number | null;
  attendance_book: string;
  section_id: number;
  section_name: string;
  seat_of_controlling_officer_id: number;
  logged_in_user_is_controller: boolean;
  logged_in_user_is_section_officer: boolean;
  designation: string;
  designation_sortindex: number | null;
  default_time_group_id: number | null;
  seniority: number | null;
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
}
export interface AttendanceBook {
  id: number;
  title: string;
  section_id: number;
}

export interface MySectionEmployees {
  employees_under_my_section: Employee[];
  sections: Section[];
  attendancebooks: AttendanceBook[];
}
