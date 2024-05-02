
export const leaveList: any[] = [
  { label: 'Casual FN', value: 'casual_fn', min_pun:1, short: 'C_FN' }, //punchingcounts = 2,1
  { label: 'Casual AN', value: 'casual_an', min_pun:1, short: 'C_AN'}, //punchingcounts = 2,1
  { label: 'Casual', value: 'casual' , min_pun:0, short: 'CL' }, //punchingcounts = 0,1,2
  { label: 'Comp Leave', value: 'comp_leave', min_pun:0, short: 'Co' }, //punchingcounts = 0
  { label: 'Earned', value: 'earned', min_pun:0, short: 'EL' }, //punchingcounts = 0
  { label: 'Commutted', value: 'commuted', min_pun:0, short: 'Cm' }, //punchingcounts = 0
  { label: 'Half-Pay', value: 'halfpay', min_pun:0, short: 'HP' }, //punchingcounts = 0. can be more if user is late and has no leave
  { label: 'Duty Off', value: 'duty_off', min_pun:0, short: 'Do' }, //punchingcounts = 0
  { label: 'Duty Leave', value: 'duty', min_pun:0, short: 'D' }, //punchingcounts = 0
  { label: 'Other', value: 'other', min_pun:0, short: 'O' },//punchingcounts = 0,1,2
  { label: 'Clear', value: 'clear', min_pun:1, short: '' }, //punchingcounts = 1,2
];
