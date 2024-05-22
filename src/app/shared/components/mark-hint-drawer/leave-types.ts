
export const leaveList: any[] = [
  { label: 'Casual FN', value: 'casual_fn', desc:'Casual FN', min_pun: 1, short: 'C_FN', showOnHoliday:false, showForCntrlOnly : false }, //punchingcounts = 2,1
  { label: 'Casual AN', value: 'casual_an', desc:'Casual AN', min_pun: 1, short: 'C_AN', showOnHoliday:false, showForCntrlOnly : false  }, //punchingcounts = 2,1
  { label: 'Casual', value: 'casual', desc:'Casual', min_pun: 0, short: 'CL', showOnHoliday:false, showForCntrlOnly : false  }, //punchingcounts = 0,1,2
  { label: 'Comp Leave', value: 'comp_leave', desc:'Compensation Leave', min_pun: 0, short: 'Co', showOnHoliday:false, showForCntrlOnly : false  }, //punchingcounts = 0
  { label: 'Comp Off', value: 'compen_for_extra', desc:'Compensation For ExtraHours', min_pun: 0, short: 'Cx', showOnHoliday:false, showForCntrlOnly : false  }, //punchingcounts = 0
  { label: 'Earned', value: 'earned', desc:'Earned Leave', min_pun: 0, short: 'EL', showOnHoliday:true , showForCntrlOnly : false }, //punchingcounts = 0
  { label: 'Commutted', value: 'commuted', desc:'Commutted Leave', min_pun: 0, short: 'Cm', showOnHoliday:true , showForCntrlOnly : false }, //punchingcounts = 0
  { label: 'Half-Pay', value: 'halfpay', desc:'Half-Pay Leave', min_pun: 0, short: 'HP', showOnHoliday:true , showForCntrlOnly : false }, //punchingcounts = 0. can be more if user is late and has no leave
  { label: 'Duty Off', value: 'duty_off', desc:'Duty Off', min_pun: 0, short: 'Do', showOnHoliday:false, showForCntrlOnly : false  }, //punchingcounts = 0
  { label: 'On Duty', value: 'duty', desc:'On Duty', min_pun: 0, short: 'OD', showOnHoliday:false, showForCntrlOnly : false  }, //punchingcounts = 0
  { label: 'Medical', value: 'medical', desc:'Medical Leave', min_pun: 0, short: 'MD', showOnHoliday:true , showForCntrlOnly : false }, //punchingcounts = 0
  { label: 'RH', value: 'restricted', desc:'Restricted', min_pun: 0, short: 'RH', showOnHoliday:false, showForCntrlOnly : false  },//punchingcounts = 0,1,2
  { label: 'Tour', value: 'tour', desc:'Tour', min_pun: 0, short: 'T', showOnHoliday:true, showForCntrlOnly : false  },//punchingcounts = 0,1,2
  { label: 'Other', value: 'other', desc:'Other', min_pun: 0, short: 'O', showOnHoliday:true , showForCntrlOnly : false },//punchingcounts = 0,1,2
  { label: 'Unauthorized', value: 'unauthorised', desc:'Unauthorized Absense', min_pun: 0, short: 'U', showOnHoliday: false, showForCntrlOnly : false  },
  { label: 'Clear', value: 'clear', desc:'', min_pun: 0, short: '', showOnHoliday:true , showForCntrlOnly : false }, //punchingcounts = 1,2

];
//also update in leave calc service
