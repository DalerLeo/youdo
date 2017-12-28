import {getLanguage} from '../helpers/storage'
import uz from './uz.json'
import en from './en.json'

const translate = (string) => {
    if (getLanguage() === 'uz') {
        return uz ? uz[string] || string : string
    } else if (getLanguage() === 'en') {
        return en ? en[string] || string : string
    }
    return string
}
export default translate
