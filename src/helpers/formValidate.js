import _ from 'lodash'
import toCamelCase from '../helpers/toCamelCase'
import {openErrorAction} from '../actions/error'
import {SubmissionError} from 'redux-form'

const validate = (formNames, dispatch, error) => {
    const errors = toCamelCase(error)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    _.map(errors, (item, index) => {
        if (!_.includes(formNames, index)) {
            return dispatch(openErrorAction({
                message: error
            }))
        }
        return null
    })

    throw new SubmissionError({
        ...errors,
        _error: nonFieldErrors
    })
}

export default validate
