
import t from './translate'
const BANK = 'bank'
const paymentTypeFormat = (type) => {
    return (type === BANK) ? t('Перечислением') : t('Наличными')
}

export default paymentTypeFormat
