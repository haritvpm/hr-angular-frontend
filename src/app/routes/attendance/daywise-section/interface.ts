import { Leave } from '../employee/interface';

export interface inTrace {
  att_time: string


}
export interface outTrace {
  att_time: string

}
export interface monthly {
  total_extra_sec: string
}

export interface AttendanceBook {
  title: string
}

export interface DailyPunching {
  // id: number;
  aadhaarid: string
  name: string
  designation: string
  section: string
  in_datetime: string
  out_datetime: string
  duration_str: string
  extra_str: string
  total_extra_sec: string
  grace_str: string
  total_grace_sec: string
  punching_count: number
  punchin_trace: inTrace
  punchout_trace: outTrace
  attendance_book: AttendanceBook
  logged_in_user_is_section_officer: boolean
  logged_in_user_is_controller: boolean
  finalized_by_controller: boolean
  remarks: string
  hint: string
  computer_hint: string
  cl_marked: number
  compen_marked: number
  cl_submitted: number
  compen_submitted: number
  other_leaves_marked: number
  single_punch_type: string
  single_punch_regularised_by: string
  is_unauthorised: boolean
  leave?: Leave

}

export interface Calender {
  attendance_trace_fetch_complete: number
  date: string
  day: number
  future_date: boolean
  holiday: boolean
  is_today: boolean
  office_ends_at: string
  rh: boolean
}

export interface DailyPunchingApi {
  punchings: DailyPunching[];
  is_future: boolean
  is_today: boolean
  is_holiday: boolean
  date_dmY: string
  sections: string[]
  calender: Calender
}
