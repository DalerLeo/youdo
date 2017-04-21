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
export const SHOP_DELETE = `/${SHOP}/%d/`

export const PRODUCT = 'dist/product'
export const PRODUCT_CREATE = `/${PRODUCT}/`
export const PRODUCT_LIST = `/${PRODUCT}/`
export const PRODUCT_ITEM = `/${PRODUCT}/%d/`
export const PRODUCT_DELETE = `/${PRODUCT}/%d/`

export const PRODUCT_TYPE = 'dist/product_type'
export const PRODUCT_TYPE_CREATE = `/${PRODUCT_TYPE}/add/`
export const PRODUCT_TYPE_LIST = `/${PRODUCT_TYPE}/`
export const PRODUCT_TYPE_ITEM = `/${PRODUCT_TYPE}/%d/`

export const BRAND = 'dist/brand'
export const BRAND_CREATE = `/${BRAND}/add/`
export const BRAND_LIST = `/${BRAND}/`
export const BRAND_ITEM = `/${BRAND}/%d/`

export const MEASUREMENT = 'dist/measurement'
export const MEASUREMENT_CREATE = `/${MEASUREMENT}/add/`
export const MEASUREMENT_LIST = `/${MEASUREMENT}/`
export const MEASUREMENT_ITEM = `/${MEASUREMENT}/%d/`