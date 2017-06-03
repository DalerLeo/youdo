import moment from 'moment'

const dateTimeFormat = (date, defaultText) => {
    return (date) ? moment(date).format('DD.MM.YYYY HH:mm:ss') : defaultText
}

export default dateTimeFormat
