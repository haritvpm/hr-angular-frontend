export interface EmployeeAttendance {
  empid: string;
  name: string;
  date1: string;
  date2: string;
}
export interface Month {
  month : number;
  year: number;
  empDet:EmployeeAttendance[];
  }

