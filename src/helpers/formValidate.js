import _ from 'lodash'
import toCamelCase from '../helpers/toCamelCase'
import {openErrorAction} from '../actions/error'
import {SubmissionError} from 'redux-form'

const validate = (formName, dispatch, error) => {
    const errors = toCamelCase(error)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    if (!_.isEmpty(nonFieldErrors)) {
        return dispatch(openErrorAction({
            message: nonFieldErrors
        }))
    }

    throw new SubmissionError({
        ...errors,
        _error: nonFieldErrors
    })
}

export default validate
