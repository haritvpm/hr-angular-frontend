export interface EmployeeAttendance {
  empid: string;
  name: string;
  date1: string;
  date2: string;
}
export interface Month {
  // empid: string;
  // name: string;
  // date1: string;
  // date2: string;
  month : number;
  year: number;
  empDet:EmployeeAttendance[];
  }

