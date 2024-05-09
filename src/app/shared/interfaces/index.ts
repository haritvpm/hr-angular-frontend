import { FormGroup, FormControl } from '@angular/forms';

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any> ? FormGroup<ControlsOf<T[K]>> : FormControl<T[K]>;
};

export interface IProfile {
  name: string;
  name_mal: string;
  email: string;
  gender: string;
 // city: string;
  address: string;
  // company: string;
  mobile: string;
  // tele: string;
  // website: string;
  dateOfJoinInKLA: string;
}
