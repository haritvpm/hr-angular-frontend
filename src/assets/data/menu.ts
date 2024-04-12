export default {
  menu: [
    {
      route: 'employee',
      name: 'employee',
      type: 'link',
      icon: 'persons',
      permissions: {
        only: ['section_access'],
      },
    },
    {
      route: 'attendence',
      name: 'attendence',
      type: 'link',
      icon: 'persons',
      permissions: {
        only: ['section_access'],
      },
    },
    {
      route: 'reporttable',
      name: 'reporttable',
      type: 'link',
      icon: 'persons',
      permissions: {
        only: ['section_access'],
      },
    },
    {
      route: 'subordinate',
      name: 'subordinate',
      type: 'link',
      icon: 'persons',
      permissions: {
        only: ['section_access'],
      },
    },
    {
      route: 'sample',
      name: 'sample',
      type: 'link',
      icon: 'persons',
      permissions: {
        only: ['section_access'],
      },
    },
    {
      route: 'tabletest',
      name: 'tabletest',
      type: 'link',
      icon: 'persons',
      permissions: {
        only: ['section_access'],
      },
    },
    {
      route: 'mattable',
      name: 'mattable',
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
