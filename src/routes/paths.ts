// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`
}

const ROOTS_AUTH = '/auth'
const ROOTS_DASHBOARD = '/dashboard'

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
}

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  paymentsuccess: '/payment-success',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
}

const ROOTS_CES = '/@ces'

export const PATH_CES = {
  root: ROOTS_CES,
  account: {
    root: path(ROOTS_CES, '/account'),
    suroot: path(ROOTS_CES, '/account/supplier-account'),
    shroot: path(ROOTS_CES, '/account/shipper-account'),
    new: path(ROOTS_CES, '/account/new'),
    edit: (id: string) => path(ROOTS_CES, `/account/${id}/edit`),
    detail: (id: string) => path(ROOTS_CES, `/account/${id}`),
  },
  suaccount: {
    root: path(ROOTS_CES, '/supplier-account'),
    detail: (id: string) => path(ROOTS_CES, `/supplier-account/${id}`),
  },
  shaccount: {
    root: path(ROOTS_CES, '/shipper-account'),
    detail: (id: string) => path(ROOTS_CES, `/shipper-account/${id}`),
  },
  company: {
    root: path(ROOTS_CES, '/company'),
    new: path(ROOTS_CES, '/company/new'),
    edit: (id: string) => path(ROOTS_CES, `/company/${id}/edit`),
    detail: (id: string) => path(ROOTS_CES, `/company/${id}`),
  },
  transaction: {
    root: path(ROOTS_CES, '/transaction'),
    detail: (id: string) => path(ROOTS_CES, `/transaction/${id}`),
  },
  benefit: {
    root: path(ROOTS_CES, '/benefit'),
    new: path(ROOTS_CES, '/benefit/new'),
    edit: (id: string) => path(ROOTS_CES, `/benefit/${id}/edit`),
    detail: (id: string) => path(ROOTS_CES, `/benefit/${id}`),
  },
  debt: {
    root: path(ROOTS_CES, '/debt'),
    detail: (id: string) => path(ROOTS_CES, `/debt/${id}`),
  },
  project: {
    root: path(ROOTS_CES, '/project'),
    new: path(ROOTS_CES, '/project/new'),
    edit: (id: string) => path(ROOTS_CES, `/project/${id}/edit`),
    detail: (id: string) => path(ROOTS_CES, `/project/${id}`),
  },
  order: {
    root: path(ROOTS_CES, '/order'),
    new: path(ROOTS_CES, '/order/new'),
    edit: (id: string) => path(ROOTS_CES, `/order/${id}/edit`),
    detail: (id: string) => path(ROOTS_CES, `/order/${id}`),
  },
  product: {
    root: path(ROOTS_CES, '/product'),
    new: path(ROOTS_CES, '/product/new'),
    edit: (id: string) => path(ROOTS_CES, `/product/${id}/edit`),
  },
  category: {
    root: path(ROOTS_CES, '/category'),
    new: path(ROOTS_CES, '/category/new'),
    edit: (id: string) => path(ROOTS_CES, `/category/${id}/edit`),
  },
}

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title: string) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
}

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction'
