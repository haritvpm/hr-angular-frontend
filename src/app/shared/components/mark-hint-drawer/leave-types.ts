
export const leaveList: any[] = [
  { label: 'Casual FN', value: 'casual_fn', desc:'Casual FN', min_pun: 1, short: 'C_FN' }, //punchingcounts = 2,1
  { label: 'Casual AN', value: 'casual_an', desc:'Casual AN', min_pun: 1, short: 'C_AN' }, //punchingcounts = 2,1
  { label: 'Casual', value: 'casual', desc:'Casual', min_pun: 0, short: 'CL' }, //punchingcounts = 0,1,2
  { label: 'Comp Leave', value: 'comp_leave', desc:'Compensation Leave', min_pun: 0, short: 'Co' }, //punchingcounts = 0
  { label: 'Earned', value: 'earned', desc:'Earned Leave', min_pun: 0, short: 'EL' }, //punchingcounts = 0
  { label: 'Commutted', value: 'commuted', desc:'Commutted Leave', min_pun: 0, short: 'Cm' }, //punchingcounts = 0
  { label: 'Half-Pay', value: 'halfpay', desc:'Half-Pay Leave', min_pun: 0, short: 'HP' }, //punchingcounts = 0. can be more if user is late and has no leave
  { label: 'Duty Off', value: 'duty_off', desc:'Duty Off', min_pun: 0, short: 'Do' }, //punchingcounts = 0
  { label: 'On Duty', value: 'duty', desc:'On Duty', min_pun: 0, short: 'OD' }, //punchingcounts = 0
  { label: 'Medical', value: 'medical', desc:'Medical Leave', min_pun: 0, short: 'MD' }, //punchingcounts = 0
  { label: 'RH', value: 'restricted', desc:'Restricted Holiday', min_pun: 0, short: 'RH' },//punchingcounts = 0,1,2
  { label: 'Other', value: 'other', desc:'Leave', min_pun: 0, short: 'O' },//punchingcounts = 0,1,2
  { label: 'Clear', value: 'clear', desc:'', min_pun: 1, short: '' }, //punchingcounts = 1,2
];
