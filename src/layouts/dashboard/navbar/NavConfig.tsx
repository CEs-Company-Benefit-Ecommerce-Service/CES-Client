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
  debt: getIcon('Sign-Contract'),
  order: getIcon('Tasks-1'),
  transaction: getIcon('Convert-Curency'),
  company: getIcon('Office-2'),
  employee: getIcon('Group-1'),
  benefit2: getIcon('Financial-Care2'),
  benefit: getIcon('Award-2'),
}

const navConfig = [
  // CES-ADMIN
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
        title: 'debt',
        path: PATH_CES.debt.root,
        icon: ICONS.debt,
        roles: [Role['System Admin'], Role['Enterprise Admin']],
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
  // {
  //   subheader: 'CES-SYSTEMADMIN',

  //   items: [{ title: 'TEST AHTHOR', path: PATH_SYS.root, icon: ICONS.user }],
  // },
  // GENERAL
  // ----------------------------------------------------------------------

  // MANAGEMENT
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'management',
  //   items: [
  //     // USER
  //     {
  //       title: 'user',
  //       path: PATH_DASHBOARD.user.root,
  //       icon: ICONS.user,
  //       children: [
  //         { title: 'profile', path: PATH_DASHBOARD.user.profile },
  //         { title: 'cards', path: PATH_DASHBOARD.user.cards },
  //         { title: 'list', path: PATH_DASHBOARD.user.list },
  //         { title: 'create', path: PATH_DASHBOARD.user.new },
  //         { title: 'edit', path: PATH_DASHBOARD.user.demoEdit },
  //         { title: 'account', path: PATH_DASHBOARD.user.account },
  //       ],
  //     },

  //     // E-COMMERCE
  //     {
  //       title: 'ecommerce',
  //       path: PATH_DASHBOARD.eCommerce.root,
  //       icon: ICONS.cart,
  //       children: [
  //         { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
  //         { title: 'product', path: PATH_DASHBOARD.eCommerce.demoView },
  //         { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
  //         { title: 'create', path: PATH_DASHBOARD.eCommerce.new },
  //         { title: 'edit', path: PATH_DASHBOARD.eCommerce.demoEdit },
  //         { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
  //       ],
  //     },

  //     // INVOICE
  //     {
  //       title: 'invoice',
  //       path: PATH_DASHBOARD.invoice.root,
  //       icon: ICONS.invoice,
  //       children: [
  //         { title: 'list', path: PATH_DASHBOARD.invoice.list },
  //         { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
  //         { title: 'create', path: PATH_DASHBOARD.invoice.new },
  //         { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
  //       ],
  //     },

  //     // BLOG
  //     {
  //       title: 'blog',
  //       path: PATH_DASHBOARD.blog.root,
  //       icon: ICONS.blog,
  //       children: [
  //         { title: 'posts', path: PATH_DASHBOARD.blog.posts },
  //         { title: 'post', path: PATH_DASHBOARD.blog.demoView },
  //         { title: 'create', path: PATH_DASHBOARD.blog.new },
  //       ],
  //     },
  //   ],
  // },

  // APP
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'app',
  //   items: [
  //     {
  //       title: 'mail',
  //       path: PATH_DASHBOARD.mail.root,
  //       icon: ICONS.mail,
  //       info: <Label color="error">+32</Label>,
  //     },
  //     { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
  //     { title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
  //     { title: 'kanban', path: PATH_DASHBOARD.kanban, icon: ICONS.kanban },
  //   ],
  // },

  // DEMO MENU STATES
  // {
  //   subheader: 'Other cases',
  //   items: [
  //     {
  //       // default roles : All roles can see this entry.
  //       // roles: ['user'] Only users can see this item.
  //       // roles: ['admin'] Only admin can see this item.
  //       // roles: ['admin', 'manager'] Only admin/manager can see this item.
  //       // Reference from 'src/guards/RoleBasedGuard'.
  //       title: 'item_by_roles',
  //       path: PATH_DASHBOARD.permissionDenied,
  //       icon: ICONS.menuItem,
  //       roles: ['admin'],
  //       caption: 'only_admin_can_see_this_item',
  //     },
  //     {
  //       title: 'menu_level_1',
  //       path: '#1',
  //       icon: ICONS.menuItem,
  //       children: [
  //         { title: 'menu_level_2', path: '#2', disabled: true },
  //         {
  //           title: 'menu_level_2',
  //           path: '#3',
  //           children: [
  //             { title: 'menu_level_3', path: '#4' },
  //             { title: 'menu_level_3', path: '#5' },
  //           ],
  //         },
  //       ],
  //     },
  //     { title: 'item_disabled', path: '#disabled', icon: ICONS.menuItem, disabled: true },
  //     {
  //       title: 'item_label',
  //       path: '#label',
  //       icon: ICONS.menuItem,
  //       info: (
  //         <Label color="info" startIcon={<Iconify icon="eva:email-fill" />}>
  //           NEW
  //         </Label>
  //       ),
  //     },
  //     { title: 'item_caption', path: '#caption', icon: ICONS.menuItem, caption: 'description' },
  //   ],
  // },
]
export default navConfig
