import React from 'react'
import {getLanguage} from '../helpers/storage'
import uz from './uz.json'
import en from './en.json'

const htmlMarkup = (output) => {
    return {__html: output}
}

const translate = (string) => {
    const currentLanguage = getLanguage()
    switch (currentLanguage) {
        case 'uz': return uz
            ? <span dangerouslySetInnerHTML={{__html: uz[string]}}/> || <span dangerouslySetInnerHTML={htmlMarkup(string)}/>
            : <span dangerouslySetInnerHTML={htmlMarkup(string)}/>
        case 'en': return en
            ? <span dangerouslySetInnerHTML={htmlMarkup(en[string])}/> || <span dangerouslySetInnerHTML={htmlMarkup(string)}/>
            : <span dangerouslySetInnerHTML={htmlMarkup(string)}/>
        default: return <span dangerouslySetInnerHTML={htmlMarkup(string)}/>
    }
}
export default translate
