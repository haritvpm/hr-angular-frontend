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
            only: ['section_access'],
          },
        },
        {
          route: 'section-monthwise-register',
          name: 'monthwiseregister',
          type: 'link',
          icon: 'calendar_view_month',
          permissions: {
            only: ['section_access'],
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

      ],
      // permissions: {
      //   only: ['section_access'],
      // },

    },

    {
      route: '',
      name: 'leaves',
      type: 'sub',
      icon: 'settings',
      children: [
        {
          route: 'leaves/approve',
          name: 'approve',
          type: 'link',
          permissions: {
            only: ['section_access'],
          },
        },
        {
          route: 'attendance/self/apply-leave',
          name: 'self',
          type: 'link',
          icon: 'person',
          permissions: {
            only: ['self_attendance_access'],
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
        }

      ],
      permissions: {
        only: ['section_access'],
      },
    },

  ],
};
