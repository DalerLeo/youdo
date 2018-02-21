import _ from 'lodash'
import toCamelCase from '../helpers/toCamelCase'
import {openErrorAction} from '../actions/error'
import {SubmissionError} from 'redux-form'

const validate = (formNames, dispatch, error) => {
    const errors = toCamelCase(error)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    const bigError = _.includes(_
        .chain(errors)
        .map((item, index) => {
            return !_.includes(formNames, index)
        })
        .value(), true)
    if (bigError) {
        return dispatch(openErrorAction({
            message: error
        }))
    }

    throw new SubmissionError({
        ...errors,
        _error: nonFieldErrors
    })
}

export default validate
