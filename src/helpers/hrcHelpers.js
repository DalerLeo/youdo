import _ from 'lodash'
import React from 'react'
import t from './translate'
import Canceled from 'material-ui/svg-icons/notification/do-not-disturb-alt'
import Completed from 'material-ui/svg-icons/action/done-all'
import InProgress from 'material-ui/svg-icons/action/cached'
import NotAssigned from '../components/CustomIcons/PersonWarn'
import {
  APPLICATION_CANCELED,
  APPLICATION_COMPLETED,
  APPLICATION_NOT_ASSIGNED,
  APPLICATION_PENDING,
  APPLICATION_REWORK,
  ZERO
} from '../constants/backendConstants'
import {
  COLOR_GREEN, COLOR_GREY,
  COLOR_RED, COLOR_YELLOW
} from '../constants/styleConstants'

const ONE = 1
const TWO = 2
const FOUR = 4
const TEN = 10
const TWELVE = 12

export const getYearText = (value) => {
  const count = value % TEN
  if (value === TWELVE) {
    return value + ' ' + t('лет')
  }
  if (count === ONE) {
    return value + ' ' + t('год')
  } else if (count >= TWO && count <= FOUR) {
    return value + ' ' + t('года')
  }
  return value + ' ' + t('лет')
}

export const getMonthText = (value) => {
  if (value === ONE) {
    return value + ' ' + t('месяц')
  } else if (value >= TWO && value <= FOUR) {
    return value + ' ' + t('месяца')
  }
  return value + ' ' + t('месяцев')
}

export const getExperienceText = (totalExp) => {
  const experienceYear = _.floor(totalExp)
  const experienceMonth = _.round(totalExp - experienceYear, ONE)
  const MULTIPLY = 10
  const expMonthOutput = experienceMonth * MULTIPLY
  const checkIfMonthExpLessZero = expMonthOutput > ZERO ? _.floor(expMonthOutput) : _.floor(expMonthOutput * MULTIPLY)
  if (totalExp > ZERO) {
    if (experienceYear > ZERO && experienceMonth > ZERO) {
      return <span>{getYearText(experienceYear)} {t('и')} {getMonthText(checkIfMonthExpLessZero)}</span>
    } else if (experienceYear > ZERO && experienceMonth <= ZERO) {
      return <span>{getYearText(experienceYear)}</span>
    }
    return <span>{getMonthText(checkIfMonthExpLessZero)}</span>
  }
  return t('без опыта работы')
}

export const getAppStatusName = (status, colored, doing) => {
  switch (status) {
    case APPLICATION_NOT_ASSIGNED: return colored ? <span style={{color: COLOR_GREY}}>{t('Неприсвоен')}</span> : t('Неприсвоен')
    case APPLICATION_COMPLETED: return colored ? <span style={{color: COLOR_GREEN}}>{t('Завершено')}</span> : t('Завершено')
    case APPLICATION_PENDING: return colored ? <span style={{color: COLOR_YELLOW}}>{t('Ожидает подтверждения')}</span> : t('Ожидает подтверждения')
    case APPLICATION_REWORK: return colored ? <span style={{color: COLOR_YELLOW}}>{t('Отправлен на доработку')}</span> : t('Отправлен на доработку')
    case APPLICATION_CANCELED: return colored ? <span style={{color: COLOR_RED}}>{t('Отменен')}</span> : t('Отменен')
    default: return colored
      ? <span style={{color: COLOR_YELLOW}}>{t('Выполняется')}</span>
      : t('Выполняется')
  }
}

export const getAppStatusIcon = (status, doing) => {
  switch (status) {
    case APPLICATION_CANCELED: return <Canceled color={COLOR_RED}/>
    case APPLICATION_NOT_ASSIGNED: return <NotAssigned color={COLOR_YELLOW}/>
    case APPLICATION_COMPLETED: return <Completed color={COLOR_GREEN}/>
    default: return <InProgress color={COLOR_YELLOW}/>
  }
}

export const getBackendNames = (iteratingArray, key) => {
  return _.get(_.find(iteratingArray, {id: key}), 'name')
}

export const getResumeStatus = () => {
  return [
    {id: 'top', name: t('Топ')},
    {id: 'on_guarantee', name: t('На гарантии')},
    {id: 'normal', name: t('Обычный')},
    {id: 'black_list', name: 'В черном списке'}
  ]
}
