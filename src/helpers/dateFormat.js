import moment from 'moment'

const dateFormat = (date, defaultText) => {
    return (date) ? moment(date).format('DD.MM.YYYY') : defaultText
}

export default dateFormat
