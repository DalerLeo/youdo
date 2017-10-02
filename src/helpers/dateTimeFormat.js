import moment from 'moment'

const dateTimeFormat = (date, defaultText) => {
    return (date) ? moment(date).locale('ru').format('DD MMM YYYY, HH:mm') : defaultText
}

export default dateTimeFormat
