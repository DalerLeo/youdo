import _ from 'lodash'

const errorsFields = (errors) => {
    const message = []

    _.forEach(errors, (item, key) => {
        const field = _.startCase(_.toLower(key))
        message.push(`${field}: ${item[0]}`)
    })

    return _.join(message, '\n')
}

export const toasterError = (errors) => {
    const detail = _.get(errors, ['detail'])
    const nonFieldErrors = _.get(errors, ['non_field_errors', 0])
    return detail || nonFieldErrors || errorsFields(errors)
}
