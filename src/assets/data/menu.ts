export default {
  menu: [
    {
      route: 'attendance',
      name: 'attendance',
      type: 'link',
      icon: 'fingerprint',
      permissions: {
        only: ['section_access'],
      },
    },
    {
      route: 'monthwiseregister',
      name: 'monthwiseregister',
      type: 'link',
      icon: 'calendar_view_month',
      permissions: {
        only: ['section_access'],
      },

    },
    {
      route: 'monthwiseregister/employee',
      name: 'self',
      type: 'link',
      icon: 'person',
      permissions: {
        only: ['section_access'],
      },
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
