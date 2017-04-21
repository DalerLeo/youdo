export const DASHBOARD_URL = '/'

export const SIGN_IN = 'sign-in'
export const SIGN_IN_URL = '/sign-in'

export const SHOP = 'shop'
export const SHOP_LIST_URL = `/${SHOP}`
export const SHOP_ITEM_URL = `${SHOP_LIST_URL}/:shopId`
export const SHOP_ITEM_TAB_URL = `${SHOP_ITEM_URL}/:tab`
export const SHOP_ITEM_PATH = `/${SHOP}/%d`
export const SHOP_ITEM_TAB_PATH = `/${SHOP}/%d/%s`

export const ORDER = 'order'
export const ORDER_HISTORY_LIST_URL = `/${ORDER}/history`

export const PRODUCT = 'product'
export const PRODUCT_LIST_URL = `/${PRODUCT}`
export const PRODUCT_ITEM_PATH = `/${PRODUCT}/%d`
