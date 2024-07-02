export default {
  menu: [

    {
      route: 'dashboard',
      name: 'dashboard',
      type: 'link',
      icon: 'dashboard',
      permissions: {
        only: ['section_access'],
      },
    },

    {
      route: 'attendance',
      name: 'attendance',
      type: 'sub',
      icon: 'fingerprint',
      children: [
        {
          route: 'section-daywise-register',
          name: 'daywiseregister',
          type: 'link',
          icon: 'fingerprint',
          permissions: {
            only: ['section_access', 'can_view_all_section_attendance'],
          },
        },
        {
          route: 'section-monthwise-register',
          name: 'monthwiseregister',
          type: 'link',
          icon: 'calendar_view_month',
          permissions: {
            only: ['section_access', 'can_view_all_section_attendance'],
          },
        },
        {
          route: 'self',
          name: 'self',
          type: 'link',
          icon: 'person',
          permissions: {
            only: ['self_attendance_access'],
          },
        },
        {
          route: 'search',
          name: 'search',
          type: 'link',
          icon: 'search',
          permissions: {
            only: ['can_view_all_section_attendance'],
          },
        },
      ],
      // permissions: {
      //   only: ['section_access'],
      // },

    },

    {
      route: '',
      name: 'leaves',
      type: 'sub',
      icon: 'sick',
      children: [
        {
          route: 'leaves/approve',
          name: 'approve',
          type: 'link',
          permissions: {
            only: ['leave_approve_access'],
          },
        },
        {
          route: 'leaves/view',
          name: 'view',
          type: 'link',
          permissions: {
            only: ['leave_apply_access'],
          },
        },
        {
          route: 'attendance/self/apply-leave',
          name: 'self',
          type: 'link',
          icon: 'person',
          permissions: {
            only: ['leave_apply_access'],
          },
        },

      ],

    },
    {
      route: 'flexi',
      name: 'flexi',
      type: 'sub',
      icon: 'more_time',
      children: [
        {
          route: 'approve',
          name: 'approve',
          type: 'link',
          permissions: {
            only: ['flexi_approve_access'],
          },
        },
        {
          route: 'view',
          name: 'view',
          type: 'link',
          permissions: {
            only: ['flexi_apply_access'],
          },
        },
        {
          route: 'apply',
          name: 'apply',
          type: 'link',
          icon: 'person',
          permissions: {
            only: ['flexi_apply_access'],
          },
        },

      ],
    },

    {
      route: 'settings',
      name: 'settings',
      type: 'sub',
      icon: 'settings',
      children: [
        {
          route: 'employee',
          name: 'employee',
          type: 'link',
          permissions: {
            only: ['section_access'],
          },
        },


      ],
      permissions: {
        only: ['section_access'],
      },
    },

  ],
};
