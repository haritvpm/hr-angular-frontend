export default {
  menu: [
    {
      route: 'attendance',
      name: 'attendance',
      type: 'link',
      icon: 'persons',
      permissions: {
        only: ['section_access'],
      },
    },
    {
      route: 'monthwiseregister',
      name: 'monthwiseregister',
      type: 'link',
      icon: 'persons',
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
