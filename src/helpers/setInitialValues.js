/* eslint dot-notation: 0 */

import _ from 'lodash'

const setInitialValues = (obj, values) => {
  _.map(values, (value, index) => {
    obj['initialValues'][index] = value
  })
}

export default setInitialValues
