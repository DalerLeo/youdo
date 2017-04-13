export const API_HOST = process.env.API_HOST
export const API_ROOT = 'api'
export const API_VERSION = 'v1'
export const API_URL = `http://${API_HOST}/${API_ROOT}/${API_VERSION}`

export const USER = 'user'
export const SIGN_IN = `/${USER}/auth/`
export const SIGN_OUT = `/${USER}/unauth/`

export const CATEGORY = 'dist/category'
export const CATEGORY_CREATE = `/${CATEGORY}/add/`
export const CATEGORY_LIST = `/${CATEGORY}/`
export const CATEGORY_ITEM = `/${CATEGORY}/%d/`

export const SHOP = 'dist/market'
export const SHOP_CREATE = `/${SHOP}/`
export const SHOP_LIST = `/${SHOP}/`
export const SHOP_ITEM = `/${SHOP}/%d/`
