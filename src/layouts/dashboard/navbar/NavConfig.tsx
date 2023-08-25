// routes
import { PATH_CES, PATH_DASHBOARD } from '../../../routes/paths'
// components
import { Role } from 'src/@types/@ces'
import SvgIconStyle from '../../../components/SvgIconStyle'

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
)

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  report: getIcon('Analitics'),
  menuItem: getIcon('ic_menu_item'),
  project: getIcon('ic_group'),
  restaurant: getIcon('Store'),
  shipper: getIcon('Bellboy'),
  category: getIcon('Reserved1'),
  product: getIcon('Paying1'),
  debt2: getIcon('Sign-Contract'),
  debt: getIcon('Card-Pay'),
  order: getIcon('Tasks-1'),
  transaction: getIcon('Convert-Curency'),
  company: getIcon('Office-2'),
  employee: getIcon('Group-1'),
  benefit2: getIcon('Financial-Care2'),
  benefit: getIcon('Award-2'),
}

export const navConfigSA = [
  {
    subheader: 'overview',
    items: [{ title: 'report', path: PATH_DASHBOARD.general.app, icon: ICONS.report }],
  },
  {
    subheader: 'Company',
    items: [
      {
        title: 'company',
        path: PATH_CES.company.root,
        icon: ICONS.company,
        roles: [Role['System Admin']],
      },
      {
        title: 'transaction',
        path: PATH_CES.transaction.root,
        icon: ICONS.transaction,
        roles: [Role['System Admin'], Role['Enterprise Admin']],
      },
      {
        title: 'debt',
        path: PATH_CES.debt.root,
        icon: ICONS.debt,
        roles: [Role['System Admin'], Role['Enterprise Admin']],
      },
    ],
  },
  {
    subheader: 'Supplier',
    items: [
      {
        title: 'supplier',
        path: PATH_CES.suaccount.root,
        icon: ICONS.restaurant,
        roles: [Role['System Admin']],
      },
      {
        title: 'category',
        path: PATH_CES.category.root,
        icon: ICONS.category,
        roles: [Role['System Admin']],
      },
      {
        title: 'shipper',
        path: PATH_CES.shaccount.root,
        icon: ICONS.shipper,
        roles: [Role['System Admin']],
      },
    ],
  },
]

export const navConfigEA = []

const navConfig = [
  {
    subheader: 'general',
    items: [{ title: 'report', path: PATH_DASHBOARD.general.app, icon: ICONS.report }],
  },
  {
    subheader: 'CES-CLIENT',
    items: [
      {
        title: 'employee',
        path: PATH_CES.account.root,
        icon: ICONS.employee,
        roles: [Role['Enterprise Admin']],
      },
      {
        title: 'benefit',
        path: PATH_CES.benefit.root,
        icon: ICONS.benefit,
        roles: [Role['Enterprise Admin']],
      },
      {
        title: 'company',
        path: PATH_CES.company.root,
        icon: ICONS.company,
        roles: [Role['System Admin']],
      },
      {
        title: 'transaction',
        path: PATH_CES.transaction.root,
        icon: ICONS.transaction,
        roles: [Role['System Admin'], Role['Enterprise Admin']],
      },
      {
        title: 'invoice',
        path: PATH_CES.debt.root,
        icon: ICONS.debt,
        roles: [Role['System Admin']],
      },
      {
        title: 'supplier',
        path: PATH_CES.suaccount.root,
        icon: ICONS.restaurant,
        roles: [Role['System Admin']],
      },
      {
        title: 'category',
        path: PATH_CES.category.root,
        icon: ICONS.category,
        roles: [Role['System Admin']],
      },
      {
        title: 'shipper',
        path: PATH_CES.shaccount.root,
        icon: ICONS.shipper,
        roles: [Role['System Admin']],
      },
      {
        title: 'order',
        path: PATH_CES.order.root,
        icon: ICONS.order,
        roles: [Role['Supplier Admin'], Role['Enterprise Admin']],
      },
      {
        title: 'product',
        path: PATH_CES.product.root,
        icon: ICONS.product,
        roles: [Role['Supplier Admin']],
      },
    ],
  },
]
export default navConfig
