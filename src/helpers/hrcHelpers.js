import _ from 'lodash'
import React from 'react'
import t from './translate'
import {ZERO} from '../constants/backendConstants'

const ONE = 1
const TWO = 2
const FOUR = 4
const TEN = 10

export const getYearText = (value) => {
    const count = value % TEN
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
    const experienceMonth = totalExp - experienceYear
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
