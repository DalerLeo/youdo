import {getLanguage} from '../helpers/storage'

const uz = {
    'Клиенты': 'Mijozlar',
    'Наименование': 'Nomi',
    'По рекомендации': 'Tavsiya qilgan',
    'Адрес': 'Manzil',
    'Дата добавления': 'Yaratilgan sanasi',
    'Сотрудник': 'Ishchi',
    'Логин': 'Login',
    'Права доступа': 'Foydalanish huquqi',
    'Телефон': 'Telefon',
    'Должность': 'Mavqeyi',
    'Статус': 'Holati'
}
const en = {
    'Клиенты': 'Clients',
    'Наименование': 'Name',
    'Адрес': 'Address',
    'Дата добавления': 'Created date',
    'Сотрудник': 'Employee',
    'Логин': 'Login',
    'Права доступа': 'Access rights',
    'Телефон': 'Phone',
    'Должность': 'Position',
    'Статус': 'Status'
}

const translate = (string) => {
    if (getLanguage() === 'uz') {
        return uz[string] || string
    } else if (getLanguage() === 'en') {
        return en[string] || string
    }
    return string
}

export default translate
