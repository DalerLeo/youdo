import moment from 'moment'
const dateFormat = (date, defaultText) => {
    return (date) ? moment(date).locale('ru').format('DD MMM, YYYY') : defaultText
}

export default dateFormat
