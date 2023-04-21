export default [
  {
    path: '/',
    redirect: '/redirecting',
  },

  {
    path: '/404',
    component: './404',
  },

  {
    path: '/g',
    routes: [
      { path: 'login', component: './g/login' },
      { path: 'sso-login', component: './g/sso-login' },
      { path: 'logout', component: './g/logout' },
    ],
  },

  {
    path: '/study-item',
    name: 'study-item',
    component: '../layouts/RootLayout',
    routes: [
      {
        path: '/study-item/dashboard',
        name: 'dashboard',
        icon: 'HomeOutlined',
        component: './study-item/dashboard',
      },
      {
        path: '/study-item/study-configuration',
        name: 'study-configuration',
        icon: 'SettingOutlined',
        component: './study-item/study-configuration',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/RootLayout',
    routes: [
      {
        path: '/my-project',
        name: 'my-project',
        icon: 'ExperimentOutlined',
        component: './my-project',
      },
      {
        path: '/organization',
        name: 'organization',
        icon: 'MedicineBoxOutlined',
        routes: [
          {
            name: 'cro',
            path: '/organization/cro',
            icon: 'ExperimentOutlined',
            component: './organization/cro',
          },
          {
            name: 'sponsor',
            path: '/organization/sponsor',
            icon: 'GroupOutlined',
            component: './organization/sponsor',
          },
          {
            name: 'site',
            path: '/organization/site',
            icon: 'MedicineBoxOutlined',
            component: './organization/site',
          },
          {
            name: 'ethic',
            path: '/organization/ethic',
            icon: 'DeploymentUnitOutlined',
            component: './organization/ethic',
          },
        ],
      },
      {
        path: '/contacts',
        name: 'contacts',
        icon: 'TeamOutlined',
        routes: [
          {
            name: 'cro',
            path: '/contacts/cro',
            icon: 'ExperimentOutlined',
            component: './contacts/cro',
          },
          {
            name: 'sponsor',
            path: '/contacts/sponsor',
            icon: 'GroupOutlined',
            component: './contacts/sponsor',
          },
          {
            name: 'site',
            path: '/contacts/site',
            icon: 'MedicineBoxOutlined',
            component: './contacts/site',
          },
          {
            name: 'ethic',
            path: '/contacts/ethic',
            icon: 'DeploymentUnitOutlined',
            component: './contacts/ethic',
          },
        ],
      },
      {
        path: 'redirecting',
        component: './redirecting',
      },
    ],
  },
];
