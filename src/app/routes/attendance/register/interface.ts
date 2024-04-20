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


export interface dateWise {
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
  grace_str:string
  total_grace_sec: string
  punchin_trace: inTrace
  punchout_trace: outTrace
}

export interface dateWiseApi {
  punchings: dateWise[];
  is_future: boolean
  is_today: boolean
  date_dmY: string

}
