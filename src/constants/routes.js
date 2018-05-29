export const DASHBOARD_URL = '/'

export const SIGN_IN = 'sign-in'
export const SIGN_IN_URL = '/sign-in'

export const USERS = 'users'
export const USERS_LIST_URL = `/${USERS}`
export const USERS_ITEM_URL = `/${USERS}/:usersId`
export const USERS_ITEM_PATH = `/${USERS}/%d`

export const CLIENT = 'client'
export const CLIENT_LIST_URL = `/${CLIENT}`
export const CLIENT_ITEM_URL = `${CLIENT_LIST_URL}/:clientId`
export const CLIENT_ITEM_PATH = `${CLIENT}/%d`

export const ACCESS_DENIED = 'access-denied'
export const ACCESS_DENIED_URL = `/${ACCESS_DENIED}`

export const PERMISSION = 'permission'
export const PERMISSION_LIST_URL = `/${PERMISSION}`
export const PERMISSION_ITEM_URL = `/${PERMISSION}/:itemId`

export const ARTICLES = 'articles'
export const ARTICLES_LIST_URL = `/${ARTICLES}`
export const ARTICLES_ITEM_URL = `/${ARTICLES}/:articleId`
export const ARTICLES_ITEM_PATH = `${ARTICLES}/%d`

export const COMPANIES = 'companies'
export const COMPANIES_LIST_URL = `/${COMPANIES}`
export const COMPANIES_ITEM_URL = `/${COMPANIES}/:companyId`
export const COMPANIES_ITEM_PATH = `${COMPANIES}/%d`

export const SKILLS = 'skills'
export const SKILLS_LIST_URL = `/${SKILLS}`
export const SKILLS_ITEM_URL = `/${SKILLS}/:skillsId`
export const SKILLS_ITEM_PATH = `/${SKILLS}/%d`

export const ROLE = 'role'
export const ROLE_LIST_URL = `/${ROLE}`
export const ROLE_ITEM_URL = `${ROLE_LIST_URL}/:roleId`
export const ROLE_ITEM_PATH = `${ROLE}/%d`

export const POST = 'post'
export const POST_LIST_URL = `/${POST}`
export const POST_ITEM_URL = `${POST_LIST_URL}/:postId`
export const POST_ITEM_PATH = `${POST}/%d`

export const REGIONS = 'regions'
export const REGIONS_LIST_URL = `/${SKILLS}`
export const REGIONS_ITEM_URL = `/${SKILLS}/:regionsId`
export const REGIONS_ITEM_PATH = `/${SKILLS}/%d`

export const LANGUAGES = 'languages'
export const LANGUAGES_LIST_URL = `/${SKILLS}`
export const LANGUAGES_ITEM_URL = `/${SKILLS}/:languagesId`
export const LANGUAGES_ITEM_PATH = `/${SKILLS}/%d`

/*
*
*/

export const HR = 'hr'
export const HR_URL = `/${HR}`
export const HR_APPLICATION = `${HR_URL}/application`
export const HR_APPLICATION_LIST_URL = `${HR_APPLICATION}`
export const HR_APPLICATION_ITEM_URL = `${HR_APPLICATION}/:applicationId`
export const HR_APPLICATION_ITEM_PATH = `${HR_APPLICATION}/%d`

export const HR_RESUME = `${HR_URL}/resume`
export const HR_RESUME_LIST_URL = `${HR_RESUME}`
export const HR_RESUME_ITEM_URL = `${HR_RESUME}/:resumeId`
export const HR_RESUME_ITEM_PATH = `${HR_RESUME}/%d`
