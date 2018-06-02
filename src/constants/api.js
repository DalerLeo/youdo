const environment = process.env
export const API_HOST = environment.API_HOST
export const API_ROOT = 'api'
export const API_VERSION = 'v1'
export const API_PROTOCOL = environment.API_PROTOCOL ? environment.API_PROTOCOL : 'http'

// Export const API_URL = `${API_PROTOCOL}://${API_HOST}/%s/${API_ROOT}/${API_VERSION}`
export const API_URL = `${API_PROTOCOL}://${API_HOST}/${API_ROOT}/${API_VERSION}`

export const USER = 'user'
export const SIGN_IN = 'api-auth/'
export const AUTH_CONFIRM = `/${USER}/auth-confirm/`
export const SIGN_OUT = `/${USER}/unauth/`

export const CLIENT = 'client'
export const CLIENT_CREATE = `/${CLIENT}/`
export const CLIENT_DELETE = `/${CLIENT}/%d/`
export const CLIENT_LIST = `/${CLIENT}/`
export const CLIENT_LIST_REPETITION = `/${CLIENT}/repetitions/`
export const CLIENT_ITEM = `/${CLIENT}/%d/`
export const CLIENT_ITEM_REPETITION = `/${CLIENT}/%d/repetition/`

export const USERS = 'main/user'
export const USERS_CREATE = `/${USERS}/`
export const USERS_LIST = `/${USERS}/`
export const USERS_ITEM = `/${USERS}/%d/`
export const USERS_DELETE = `/${USERS}/%d/`
export const USERS_GROUP = 'user/group/gcrud/'
export const USERS_GROUP_ITEM = `/${USERS_GROUP}/%d/`

export const FILE_UPLOAD = '/main/file/'

export const NOTIFICATIONS = 'notification/notifications'
export const NOTIFICATIONS_LIST = `/${NOTIFICATIONS}/`
export const NOTIFICATIONS_DELETE = `/${NOTIFICATIONS}/%d/`
export const NOTIFICATIONS_GET_COUNT = 'notification/notifications/get_not_viewed'

export const ACCESS = 'main/access'
export const ACCESS_LIST = `${ACCESS}/`
export const ACCESS_ITEM = `${ACCESS}/%d/`

export const ARTICLES = 'blog/posts'
export const ARTICLES_CREATE = `/${ARTICLES}/`
export const ARTICLES_LIST = `/${ARTICLES}/`
export const ARTICLES_ITEM = `/${ARTICLES}/%d/`
export const ARTICLES_DELETE = `/${ARTICLES}/%d/`

export const COMPANIES = 'companies/company'
export const COMPANIES_CREATE = `/${COMPANIES}/`
export const COMPANIES_LIST = `/${COMPANIES}/`
export const COMPANIES_ITEM = `/${COMPANIES}/%d/`
export const COMPANIES_DELETE = `/${COMPANIES}/%d/`

export const POSITIONS = 'main/professions'
export const POSITIONS_CREATE = `/${POSITIONS}/`
export const POSITIONS_LIST = `/${POSITIONS}/`
export const POSITIONS_ITEM = `/${POSITIONS}/%d/`
export const POSITIONS_DELETE = `/${POSITIONS}/%d/`

export const SKILLS = 'main/skills'
export const SKILLS_CREATE = `/${SKILLS}/`
export const SKILLS_LIST = `/${SKILLS}/`
export const SKILLS_ITEM = `/${SKILLS}/%d/`
export const SKILLS_DELETE = `/${SKILLS}/%d/`

export const LANGUAGES = 'main/languages'
export const LANGUAGES_CREATE = `/${LANGUAGES}/`
export const LANGUAGES_LIST = `/${LANGUAGES}/`
export const LANGUAGES_ITEM = `/${LANGUAGES}/%d/`
export const LANGUAGES_DELETE = `/${LANGUAGES}/%d/`

export const REGIONS = 'main/regions'
export const REGIONS_CREATE = `/${REGIONS}/`
export const REGIONS_LIST = `/${REGIONS}/`
export const REGIONS_ITEM = `/${REGIONS}/%d/`
export const REGIONS_DELETE = `/${REGIONS}/%d/`

/*
*
*/

export const HR_APPLICATION = 'hr/application'
export const HR_APPLICATION_CREATE = `/${HR_APPLICATION}/`
export const HR_APPLICATION_DELETE = `/${HR_APPLICATION}/%d/`
export const HR_APPLICATION_LIST = `/${HR_APPLICATION}/`
export const HR_APPLICATION_ITEM = `/${HR_APPLICATION}/%d/`

export const HR_APPLICATION_ACTION = 'hr/application_action'
export const HR_APP_LOGS_LIST = `/${HR_APPLICATION_ACTION}/`
export const HR_APP_CHANGE_ACTION = `/${HR_APPLICATION_ACTION}/`

export const HR_APP_APPROVAL = 'hr/application_approval'
export const HR_APP_UPDATE_MEETING = `/${HR_APP_APPROVAL}/%d/`
export const HR_APP_CREATE_MEETING_MULTI = `/${HR_APP_APPROVAL}/multi/`
export const HR_APP_GET_MEETING_LIST = `/${HR_APP_APPROVAL}/`
export const HR_APP_COMPLETE = `/${HR_APPLICATION}/%d/complete/`

export const HR_POSITION = 'hr/position'
export const HR_POSITION_LIST = `/${HR_POSITION}/`
export const HR_POSITION_ITEM = `/${HR_POSITION}/%d/`

export const HR_SKILLS = 'hr/skill'
export const HR_SKILLS_LIST = `/${HR_SKILLS}/`

export const HR_PRIVILEGE = 'hr/privilege'
export const HR_PRIVILEGE_LIST = `/${HR_PRIVILEGE}`

export const HR_LANGUAGE = 'hr/language'
export const HR_LANGUAGE_LIST = `/${HR_LANGUAGE}/`
export const HR_LANGUAGE_ITEM = `/${HR_LANGUAGE}/%d/`

export const HR_RESUME = 'hr/resume'
export const HR_RESUME_CREATE = `/${HR_RESUME}/`
export const HR_RESUME_DELETE = `/${HR_RESUME}/%d/`
export const HR_RESUME_LIST = `/${HR_RESUME}/`
export const HR_RESUME_ITEM = `/${HR_RESUME}/%d/`
export const HR_RESUME_UPDATE_STATUS = `/${HR_RESUME}/change_status/`

export const HR_COUNTRY = 'hr/country'
export const HR_COUNTRY_LIST = `/${HR_COUNTRY}/`
export const HR_COUNTRY_ITEM = `/${HR_COUNTRY}/%d/`

export const HR_CITY = 'hr/city'
export const HR_CITY_LIST = `/${HR_CITY}/`
export const HR_CITY_ITEM = `/${HR_CITY}/%d/`

export const ROLE = 'main/group'
export const ROLE_COURSE_CREATE = 'finance/currency_rate/'
export const ROLE_CREATE = `/${ROLE}/`
export const ROLE_LIST = `/${ROLE}/`
export const ROLE_DELETE = `/${ROLE}/%d/`
export const ROLE_ITEM = `/${ROLE}/%d/`
export const ROLE_PRIMARY = 'currency_primary'
export const ROLE_RATE = `/${ROLE}/%d/permissions/`
export const ROLE_PERMISSION = 'main/permissions/'

export const POST = 'main/position'
export const POST_CREATE = `/${POST}/`
export const POST_LIST = `/${POST}/`
export const POST_ITEM = `/${POST}/%d/`
export const POST_DELETE = `/${POST}/%d/`

export const COMPANY_TYPE = 'main/kinds'
export const COMPANY_TYPE_H_LIST = `/${COMPANY_TYPE}/`
export const COMPANY_TYPE_ITEM = `/${COMPANY_TYPE}/%d`
export const COMPANY_TYPE_UPDATE = `/${COMPANY_TYPE}/%d`
export const COMPANY_TYPE_CREATE = `/${COMPANY_TYPE}/`
export const COMPANY_TYPE_DELETE = `/${COMPANY_TYPE}/%d`

export const APPLICANT = 'specialists/specialists'
export const APPLICANT_CREATE = `/${APPLICANT}/`
export const APPLICANT_LIST = `/${APPLICANT}/`
export const APPLICANT_ITEM = `/${APPLICANT}/%d/`
export const APPLICANT_DELETE = `/${APPLICANT}/%d/`
export const APPLICANT_GROUP = 'user/group/gcrud/'
export const APPLICANT_GROUP_ITEM = `/${APPLICANT_GROUP}/%d/`

export const COUNTRY_LIST = 'main/country/'
export const COUNTRY_ITEM = 'main/country/%d/'
