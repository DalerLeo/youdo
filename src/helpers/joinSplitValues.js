import _ from 'lodash'
export const joinArray = (array) => {
  return _.join(array, '-')
}

export const splitToArray = (value) => {
  return _.map(_.split(value, '-'), (item) => {
    return !_.isNaN(_.toNumber(item)) ? _.toNumber(item) : item
  })
}
