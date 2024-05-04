export interface CalendarDayInfo {
  holiday: boolean;
  rh: boolean;
  office_ends_at: string;
  future_date: boolean;
  is_today: boolean;
}

export interface MonthlyData {
  id: number;
  aadhaarid: string;
  month: string;
  cl_marked: number;
  compen_marked: number | null;
  compoff_granted: number | null;
  total_grace_sec: number;
  total_extra_sec: number;
  total_grace_str: string | null;
  total_extra_str: string | null;
  grace_exceeded_sec: number | null;
  created_at: string;
  updated_at: string;
  employee_id: number;
  total_grace_exceeded300_date: string | null;
  cl_submitted: number;
  compen_submitted: number;
  other_leaves_marked: number;
  other_leaves_submitted: number;
}

export interface EmployeePunchingInfo {
  sl: number;
  day: string;
  day_str: string;
  punching_count: number;
  logged_in_user_is_controller: boolean;
  logged_in_user_is_section_officer: boolean;
  id?: number;
  date?: string;
  aadhaarid?: string;
  name?: string;
  designation?: string;
  section?: string | null;
  in_datetime?: string | null;
  out_datetime?: string | null;
  duration_sec?: number;
  grace_sec?: number;
  extra_sec?: number;
  duration_str?: string;
  grace_str?: string;
  extra_str?: string;
  remarks?: string | null;
  finalized_by_controller?: string | null;
  ot_sitting_sec?: number | null;
  ot_nonsitting_sec?: number | null;
  hint?: string | null;
  controller_set_punch_in?: string | null;
  controller_set_punch_out?: string | null;
  grace_total_exceeded_one_hour?: number;
  created_at?: string;
  updated_at?: string;
  punchin_trace_id?: number | null;
  punchout_trace_id?: number | null;
  leave_id?: number | null;
  punchin_trace?: PunchTrace | null;
  punchout_trace?: PunchTrace | null;
  leave?: Leave;
  in_section: boolean;
}

export interface PunchTrace {
  id: number;
  aadhaarid: string;
  org_emp_code: string | null;
  device: string;
  attendance_type: string;
  auth_status: string;
  err_code: string;
  att_date: string;
  att_time: string;
  day_offset: number;
  created_date: string;
  created_at: string;
  updated_at: string;
  punching_id: number | null;
}

export interface Employee {
  id: number;
  aadhaarid: string;
  is_shift: boolean;
  name: string | null;
}

export interface Leave {
  id: number;
  aadhaarid: string;
  employee_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  active_status: string;
  leave_cat: string;
  time_period: string;
  in_lieu_of: string;
  last_updated: string;
  creation_date: string;
  created_by_aadhaarid: string;

}

export interface MonthwiseEmployeeApiData {
  month: string;
  calender_info: { [day: string]: CalendarDayInfo };
  data_monthly: { [aadhaarid: string]: MonthlyData };
  employee_punching: EmployeePunchingInfo[];
  employee: Employee;
}
export interface EmployeeArgs {
  aadhaarid: string;
  date: string;
  self: boolean;
}
