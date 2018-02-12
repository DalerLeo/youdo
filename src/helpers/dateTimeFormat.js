import moment from 'moment'
import {getLanguage} from './storage'

const dateTimeFormat = (date, defaultText) => {
    const local = getLanguage() === 'uz' ? 'ru' : getLanguage()
    return (date) ? moment(date).locale(local).format('DD MMM YYYY, HH:mm') : defaultText
}

export default dateTimeFormat
