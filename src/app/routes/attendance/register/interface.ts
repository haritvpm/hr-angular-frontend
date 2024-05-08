export interface inTrace {
  att_time: string


}
export interface outTrace {
  att_time: string

}
export interface monthly {
  total_extra_sec: string
}
// export interface Monthly{
//   [aadharid: string]: monthly[];

// }

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
  cl_marked: number
  compen_marked: number
  other_leaves_marked: number



}

export interface DailyPunchingApi {
  punchings: DailyPunching[];
  is_future: boolean
  is_today: boolean
  is_holiday: boolean
  date_dmY: string
  sections: string[]
}
