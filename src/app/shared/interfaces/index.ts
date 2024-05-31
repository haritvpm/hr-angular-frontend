import { FormGroup, FormControl } from '@angular/forms';

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any> ? FormGroup<ControlsOf<T[K]>> : FormControl<T[K]>;
};

export interface IProfile {
  name: string | null;
  name_mal: string | null;
  email: string | null;
  srismt: string | null;
 // city: string;
  address: string  | null;
  // company: string;
  mobile: string | null;
  pan: string | null;
  klaid: string | null;
  dateOfJoinInKLA: string | null;
  dateOfEntryInService: string  | null;
  dateOfCommencementOfContinousService: string  | null;
  dob: string | null;
}
