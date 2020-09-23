import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
export const constantRouterMap = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path(.*)',
    component: () =>
				import('@/views/redirect/index')
  }]
},
{
  path: '/login',
  component: () =>
			import('@/views/login/index'),
  hidden: true
},
{
  path: '/gugemap',
  component: () =>
			import('@/views/guge/guge'),
  hidden: true
},
{
  path: '/auth-redirect',
  component: () =>
			import('@/views/login/auth-redirect'),
  hidden: true
},
{
  path: '/404',
  component: () =>
			import('@/views/error-page/404'),
  hidden: true
},
{
  path: '/401',
  component: () =>
			import('@/views/error-page/401'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    component: () =>
				import('@/views/dashboard/homepage'),
    name: 'Dashboard',
    meta: {
      title: 'administration',
      icon: '',
      affix: true
    }
  }]
}
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRouterMap = [
	//	物业管理
	{
		path: '/property-management',
		component: Layout,
		redirect: '/property-management/property-information',
		name: 'PropertyManagement',
		alwaysShow: true,
		meta: {
			title: 'propertymanagement',
			icon: 'area',
			name: '10001'
		},
		children: [{
			path: 'property-information',
			component: () =>
				import('@/views/property-management/property-information'),
			name: 'PropertyInformation',
			meta: {
				title: 'PropertyInformation',
				icon: '',
				name: '10001-1'
			}
		}]
	},
	//	小区管理
	{
		// path: '/community-management',
		path: '/area',
		component: Layout,
		redirect: '/area/my-neighborhood',
		name: 'Area',
		alwaysShow: true,
		meta: {
			title: 'commanagement',
			icon: 'area',
			name: "10003"
		},
		children: [{
			path: 'my-neighborhood',
			component: () =>
				import('@/views/area/my-neighborhood'),
			name: 'MyNeighborhood',
			meta: {
				title: 'myneighborhood',
				icon: '',
				name: "10003-1"
			}
		}]
	},
	//	用户管理（运营）
	{
		// path: '/community-management',
		path: '/user',
		component: Layout,
		redirect: '/user/user-information',
		name: 'UserManagement',
		alwaysShow: true,
		meta: {
			title: 'usermanagement',
			icon: 'area',
			name: "10002"
		},
		children: [{
			path: 'user-information',
			component: () =>
				import('@/views/user/user-information'),
			name: 'UserInformation',
			meta: {
				title: 'userinformation',
				icon: '',
				name: "10002-1"

			}
		}]
	},
	//	app启动页配置
	{
		path: '/homePage',
		component: Layout,
		redirect: '/homePage/page-configuration',
		name: 'Area',
		alwaysShow: true,
		meta: {
			title: 'pageconfiguration',
			icon: 'area',
			name: "10007"
		},
		children: [{
			path: 'homepage-information',
			component: () =>
				import('@/views/page-configuration/homepage-information'),
			name: 'HomepageInformation',
			meta: {
				title: 'homepageinformation',
				icon: '',
				name: "10007-1"
			}
		}, {
			path: 'banner-information',
			component: () =>
				import('@/views/page-configuration/banner-information'),
			name: 'BannerInformation',
			meta: {
				title: 'bannerinformation',
				icon: '',
				name: "10007-2"
			}
		}]
	},
	// 资产管理
	{
		path: '/asse',
		component: Layout,
		redirect: 'noRedirect',
		name: 'Asse',
		meta: {
			title: ' assmanagement',
			icon: 'asse',
			name: "10006"
		},
		children: [{
				path: 'building',
				component: () =>
					import('@/views/asse/building'),
				name: 'Building',
				meta: {
					title: 'buiinformation',
					noCache: true,
					name: "10006-1"
				}
			},
			{
				path: 'unit',
				component: () =>
					import('@/views/asse/unit'),
				name: 'Unit',
				meta: {
					title: 'uniinformation',
					noCache: true,
					name: "10006-2"
				}
			},
			{
				path: 'room-management',
				component: () =>
					import('@/views/asse/room-management'),
				name: 'RoomManagement',
				meta: {
					title: 'roomanagement',
					noCache: true,
					name: "10006-3"
				}
			}
		]
	},
	// 业主管理
	{
		path: '/owner-management',
		component: Layout,
		redirect: '/owner-management/owner-information',
		name: 'OwnerManagement',
		meta: {
			title: ' ownmanagement',
			icon: 'owner',
			name: "10004"
		},
		children: [{
				path: 'owner-information',
				component: () =>
					import('@/views/owner-management/owner-information'),

				name: 'OwnerIinformation',
				meta: {
					title: 'owninformation',
					name: "10004-1"
				}
			},
			{
				path: 'owner-member',
				component: () =>
					import('@/views/owner-management/components/owner-member'),
				name: 'OwnerMember',
//				 meta: {
////				   title: 'ownmember',
//				   name: "10004-2"
//				 }
			},
			{
				path: 'binding-rooms',
				component: () =>
					import('@/views/owner-management/components/binding-rooms')
			},
			{
				path: 'choose-house',
				component: () =>
					import('@/views/owner-management/components/choose-house')
			},
			{
				path: 'last',
				component: () =>
					import('@/views/owner-management/components/last')
			},
			{
				path: 'unbundling',
				component: () =>
					import('@/views/owner-management/components/unbundling')
			},
			{
				path: 'home',
				component: () =>
					import('@/views/owner-management/home')
				// redirect: '/owner-management/binding-rooms'
			}
		]
	},
	// 费用管理
	{
		path: '/cost-management',
		component: Layout,
		redirect: '/cost-management/expense-item',
		alwaysShow: true,
		name: 'Costmanagement',
		meta: {
			title: 'cosmanagement',
			icon: 'cost',
			name: "10008"
		},
		children: [{
				path: 'expense-item',
				component: () =>
					
					import('@/views/cost-management/expense-item'),
				name: 'ExpenseItem',
				meta: {
					title: ' expsettings',
					name: "10008-1"
				}
			},
			{
				path: 'house-charge',
				component: () =>
					import('@/views/cost-management/house-charge'),
				name: 'HouseCharge',
				meta: {
					title: 'houcharge',
					name: "10008-2"
				}
			},
			{
				path: 'parking-charge',
				component: () =>
					import('@/views/cost-management/parking-charge'),
				name: 'ParkingCharge',
				meta: {
					title: 'parcharge',
					name: "10008-3"
				}
			},
			{
				path: 'payment-list',
				component: () =>
					import('@/views/cost-management/payment-list'),
				name: 'PaymentList',
				meta: {
					title: 'paylist',
					name: "10008-4"
				}
			},
			{
				path: 'expense-bill',
				component: () =>
					import('@/views/cost-management/expense-bill'),
				name: 'ExpenseBill',
				meta: {
					title: 'expbill',
					name: "10008-5"
				}
			},
			{
				path: 'staff-charges',
				component: () =>
					import('@/views/cost-management/staff-charges'),
				name: 'StaffCharges',
				meta: {
					title: 'stacharges'
				}
			},
			{
				path: 'temporary-payment',
				component: () =>
					import('@/views/cost-management/temporary-payment'),
				name: 'TemporaryPayment',
				meta: {
					title: 'temlist'
				}
			},
			{
				path: 'expense-summary',
				component: () =>
					import('@/views/cost-management/expense-summary'),
				name: 'ExpenseSummary',
				meta: {
					title: 'expsummary'
				}
			},
			{
				path: 'refund-review',
				component: () =>
					import('@/views/cost-management/refund-review'),

				name: 'RefundReview',
				meta: {
					title: 'refreview'
				}
			}
		]
	},

	//设备管理
	{
		path: '/device-management',
		component: Layout,
		redirect: '/device-management/access-control',
		alwaysShow: true,
		name: 'DeviceManagement',
		meta: {
			title: 'devmanagement',
			icon: 'device',
			name: "10005"
		},
		children: [{
				path: 'equipment-information',
				component: () =>
//>>>>>>> Stashed changes
					import('@/views/device-management/equipment-information'),
				name: 'EquipmentInformation',
				meta: {
					title: 'equipmentinformation',
					name: "10005-1"
				}
			}, {
				path: 'access-control',
				component: () =>
					import('@/views/device-management/access-control'),
      name: 'AccessControl',
      meta: {
        title: 'equcontrol'
      }
    },
    {
      path: 'data-synchronization',
      component: () =>
					import('@/views/device-management/data-synchronization'),
      name: 'DataSynchronization',
      meta: {
        title: 'devsynchronization'
      }
    },
    {
      path: 'opening-record',
      component: () =>
					import('@/views/device-management/opening-record'),
      name: 'OpeningRecord',
      meta: {
        title: 'doorecord'
      }
    },
    {
      path: 'photos-visitors',
      component: () =>
					import('@/views/device-management/photos-visitors'),
      name: 'PhotosVisitors',
      meta: {
        title: 'phovisitors'
      }
    },
    {
      path: 'apply-key',
      component: () =>
					import('@/views/device-management/apply-key'),
      name: 'ApplyKey',
      meta: {
        title: 'appkey'
      }
    },
    {
      path: 'key-audit',
      component: () =>
					import('@/views/device-management/key-audit'),
				name: 'KeyAudit',
				meta: {
					title: ' keyaudit'
				}
			}
		]
	},
	// 系统管理
	{
		path: '/systemManagement',
		component: Layout,
		redirect: '/systemManagement/permission-group',
		alwaysShow: true,
		name: 'systemManagement',
		meta: {
			title: 'sysmanagement',
			icon: 'system',
			name: "200001"
		},
		children: [{
				path: 'permission-group',
				component: () =>
					import('@/views/system-management/permission-group'),
				name: 'PermissionGroup',
				meta: {
					title: 'pergroup',
					name: "200001-1"
				}
			},
			{
				path: 'employee-rights',
				component: () =>
					import('@/views/system-management/employee-rights'),

				name: 'EmployeeRights',
				meta: {
					title: 'emprights'
				},
				hidden: true
			},
			{
				path: 'auditor',
				component: () =>
					import('@/views/system-management/auditor'),
				name: 'Auditor',
				meta: {
					title: 'auditor'
				},
				hidden: true
			},
			{
				path: 'asset-access',
				component: () =>
					import('@/views/system-management/asset-access'),
				name: 'AssetAccess',
				meta: {
					title: 'assexport'
				},
				hidden: true
			}
//			{
//				path: 'change-password',
//				component: () =>
//					import('@/views/system-management/change-password'),
//				name: 'ChangePassword',
//				meta: {
//					title: 'chaPassword'
//				}
//			},
//			{
//				path: 'merchant-information',
//				component: () =>
//					import('@/views/system-management/merchant-information'),
//				name: 'MerchantInformation',
//				meta: {
//					title: 'merinformation'
//				}
//			},
//			{
//				path: 'applet',
//				component: () =>
//					import('@/views/system-management/applet'),
//				name: 'Applet',
//				meta: {
//					title: 'appconfiguration'
//				}
//			},
//			{
//				path: 'position-information',
//				component: () =>
//					import('@/views/system-management/position-information'),
//				name: 'PositionInformation',
//				meta: {
//					title: 'posinformation'
//				}
//			}
		]
	}
	// 巡检管理
//	{
//		path: '/patrol',
//		component: Layout,
//		redirect: '/patrol/inspection-point',
//		alwaysShow: true,
//		name: 'Patrol',
//		meta: {
//			title: 'patmanagement',
//			icon: 'patrol'
//		},
//		children: [{
//				path: 'inspection-point',
//				component: () =>
//					import('@/views/patrol/inspection-point'),
//				name: 'InspectionPoint',
//				meta: {
//					title: 'inspoint'
//				}
//			},
//			{
//				path: 'patrol-route',
//				component: () =>
//					import('@/views/patrol/patrol-route'),
//				name: 'PatrolRoute',
//				meta: {
//					title: 'patroute'
//				}
//			},
//			{
//				path: 'inspection-plan',
//				component: () =>
//					import('@/views/patrol/inspection-plan'),
//				name: 'InspectionPlan',
//				meta: {
//					title: 'insplan'
//				}
//			},
//			{
//				path: 'patrol-task',
//				component: () =>
//					import('@/views/patrol/patrol-task'),
//				name: 'PatrolTask',
//				meta: {
//					title: 'pattask'
//				}
//			}
//		]
//	}
	
//>>>>>>> Stashed changes

  // /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'externalLink', icon: 'link' }
  //     }
  //   ]
  // },

  // // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
