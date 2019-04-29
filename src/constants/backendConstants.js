import t from '../helpers/translate'

export const SUM_CURRENCY = 'UZS'
export const ZERO = 0

export const ORDER_REQUESTED = 0
export const ORDER_READY = 1
export const ORDER_GIVEN = 2
export const ORDER_DELIVERED = 3
export const ORDER_CANCELED = 4
export const ORDER_NOT_CONFIRMED = 5
export const ORDER_TYPE_DELIVERY = 'delivery'
export const ORDER_TYPE_SELF = 'self'

export const ORDER_RETURN_PENDING = 0
export const ORDER_RETURN_IN_PROGRESS = 1
export const ORDER_RETURN_COMPLETED = 2
export const ORDER_RETURN_CANCELED = 3

export const SUPPLY_PENDING = 0
export const SUPPLY_IN_PROGRESS = 1
export const SUPPLY_COMPLETED = 2
export const SUPPLY_CANCELED = 4

export const ACTIVITY_VISIT = 1
export const ACTIVITY_ORDER = 2
export const ACTIVITY_REPORT = 3
export const ACTIVITY_ORDER_RETURN = 4
export const ACTIVITY_PAYMENT = 5
export const ACTIVITY_DELIVERY = 6

export const MARKET_FREQ_EVERY_DAY = '1'
export const MARKET_FREQ_ONCE_IN_A_WEEK = '2'
export const MARKET_FREQ_TWICE_IN_A_WEEK = '3'
export const MARKET_FREQ_IN_A_DAY = '4'

export const APPLICATION_NOT_ASSIGNED = 'not_assigned'
export const APPLICATION_ASSIGNED = 'assigned'
export const APPLICATION_CANCELED = 'canceled'
export const APPLICATION_COMPLETED = 'completed'
export const APPLICATION_PENDING = 'pending'

export const PENDING = 'pending'
export const DONE = 'done'
export const PASSED = 'passed'

export const HR_DRIVER_LICENSE = [
  {id: 'A', name: 'A', active: false},
  {id: 'B', name: 'B', active: false},
  {id: 'C', name: 'C', active: false},
  {id: 'D', name: 'D', active: false},
  {id: 'BE', name: 'BE', active: false},
  {id: 'CE', name: 'CE', active: false},
  {id: 'DE', name: 'DE', active: false}
]

export const HR_WORK_SCHEDULE = [
  {id: 'full_time', name: t('Полный рабочий день')},
  {id: 'shift_work', name: t('Сменный график')},
  {id: 'remote', name: t('Удаленно')},
  {id: 'part_time', name: t('Частичная занятость')}
]

export const HR_LEVEL_PC = [
  {id: 'user', name: t('Пользователь')},
  {id: 'confident_user', name: t('Уверенный пользователь')},
  {id: 'advanced_user', name: t('Продвинутый пользователь')},
  {id: 'professional_level', name: t('Профессиональный уровень')}
]

export const HR_GENDER = [
  {id: 'no_matter', name: t('Не имеет значения')},
  {id: 'male', name: t('Мужской')},
  {id: 'female', name: t('Женский')}
]

export const HR_EDUCATION = [
  {id: 'no_matter', name: t('Не имеет значения')},
  {id: 'secondary', name: t('Среднее')},
  {id: 'higher', name: t('Высшее')},
  {id: 'master', name: t('Магистратура')},
  {id: 'doctoral', name: t('Докторантура')}
]

export const HR_LANG_LEVELS = [
  {id: 'beginner', name: t('Начальный')},
  {id: 'intermediate', name: t('Средний')},
  {id: 'advanced', name: t('Продвинутый')},
  {id: 'fluent', name: t('Свободное владение')}
]

export const HR_RESUME_SHORT = 'short'
export const HR_RESUME_REPORT = 'report'
export const HR_RESUME_REMOVED = 'removed'
export const HR_RESUME_MEETING = 'meeting'
export const HR_RESUME_FAILED = 'failed'
export const HR_RESUME_LONG = 'long'
export const HR_RESUME_NOTE = 'note'

export const USERS_STATUS = [
  {id: 'active', name: t('Активный')},
  {id: 'fired', name: t('Уволен')},
  {id: 'on_vacation', name: t('Отпуск')}
]

export const APPLICANT_STATUS = [
  {id: 'no', name: t('Не указан')},
  {id: 'active', name: t('Активный')},
  {id: 'blocked', name: t('Заблокированный')}
]
export const ACTIVITY_STATUS = [
  {id: 'other', name: t('Другое')},
  {id: 'in_active_search', name: t('В активном поиске')},
  {id: 'considering_proposals', name: t('Рассматриваю предложения')},
  {id: 'not_looking_for_job', name: t('Не ищу работу')}
]

export const PROFILE_LANG = [
  {id: 'en', name: 'Узбекский'},
  {id: 'ru', name: 'Русский'}
]

export const PROJECT_VISIBILITY = [
  {id: 'True', name: 'Всем'},
  {id: 'False', name: 'Рабочей группе'}
]

export const STATUS_LIST = [
  {id: 'unconfirmed', name: 'неподтвержденный'},
  {id: 'confirmed', name: 'подтвержденный'}
]
