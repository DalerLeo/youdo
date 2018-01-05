import moment from 'moment'
const dateFormat = (date, time, defaultText) => {
    const dateTime = moment(date).locale('ru').format('DD MMM YYYY, HH:mm')
    return (date && time) ? dateTime : (date) ? moment(date).locale('ru').format('DD MMM YYYY') : defaultText
}

export default dateFormat
