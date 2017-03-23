export const API_HOST = process.env.API_HOST
export const API_ROOT = 'api'
export const API_VERSION = 'v1'
export const API_URL = `http://${API_HOST}/${API_ROOT}/${API_VERSION}`

export const USER = 'user'
export const SIGN_IN = `/${USER}/auth/`
export const SIGN_OUT = `/${USER}/unauth/`

export const ACCOUNT = 'account'
export const ACCOUNT_SEARCH = `/${ACCOUNT}/list/`

export const DAILY_ENTRY = 'daily-entry'
export const DAILY_ENTRY_CREATE = `/${DAILY_ENTRY}/add/`
export const DAILY_ENTRY_LIST = `/${DAILY_ENTRY}/list/`
export const DAILY_ENTRY_ITEM = `/${DAILY_ENTRY}/%d/`

export const BALANCE = 'balance'
export const BALANCE_CREATE = `/${BALANCE}/`
export const BALANCE_LIST = `/${BALANCE}/`
export const BALANCE_ITEM = `/${BALANCE}/%d/`

export const SHOP = 'dist/market'
export const SHOP_CREATE = `/${SHOP}/`
export const SHOP_LIST = `/${SHOP}/`
export const SHOP_ITEM = `/${SHOP}/%d/`

export const BROKER = 'broker'
export const BROKER_LIST = `/${BROKER}/`
export const BROKER_ITEM = `/${BROKER}/%s/`
export const BROKER_EDIT = `/${BROKER}/%s/`
export const BROKER_DELETE = `${BROKER}/%s/`

export const MONTHLY_REPORT = 'monthly'
export const MONTHLY_REPORT_LIST = `/${MONTHLY_REPORT}/`
export const MONTHLY_REPORT_ITEM = `/${MONTHLY_REPORT}/%s/`
export const MONTHLY_REPORT_EDIT = `/${MONTHLY_REPORT}/%s/`
export const MONTHLY_REPORT_DELETE = `/${MONTHLY_REPORT}/%s/`

export const FUND_MANAGER = 'fund-manager'
export const FUND_MANAGER_LIST = `/${FUND_MANAGER}/`

export const FUND_MANAGER_ITEM = `/${FUND_MANAGER}/%s/`
export const FUND_MANAGER_EDIT = `/${FUND_MANAGER}/%s/`
export const FUND_MANAGER_DELETE = `/${FUND_MANAGER}/%s/`

export const DAILY_REPORT = 'daily-report'
export const DAILY_REPORT_LIST = `/${DAILY_REPORT}/list/`
export const DAILY_REPORT_TOTAL = `/${DAILY_REPORT}/total/`

export const CLIENT = 'client'
export const CLIENT_LIST = `${CLIENT}/list/`
export const CLIENT_ADD = `/${CLIENT}/add/`

export const ACCOUNT_CREATE = 'account-create'
export const ACCOUNT_CREATE_ADD = `/${ACCOUNT_CREATE}/add`

export const STATICS = 'statics'
export const STATICS_ALL_PROFIT_AND_LOSS = `/${STATICS}/all-profit-and-loss/`
export const STATICS_DAY_BY_PROFIT_AND_LOSS = `/${STATICS}/day-by-profit-and-loss/`
