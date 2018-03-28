import t from './translate'

export const getYearText = (value) => {
    const ONE = 1
    const TWO = 2
    const FOUR = 4
    const TEN = 10
    const count = value % TEN
    if (count === ONE) {
        return value + ' ' + t('год')
    } else if (count >= TWO && count <= FOUR) {
        return value + ' ' + t('года')
    }
    return value + ' ' + t('лет')
}
