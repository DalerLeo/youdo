import {getLanguage} from '../helpers/storage'
import uz from './uz.json'
import en from './en.json'

const translate = (string) => {
  const currentLanguage = getLanguage()
  switch (currentLanguage) {
    case 'uz': return uz ? uz[string] || string : string
    case 'en': return en ? en[string] || string : string
    default: return string
  }
}
export default translate
