import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data) => {
  const email = _.get(data, 'email')
  const firstNameRu = _.get(data, 'firstNameRu')
  const lastNameRu = _.get(data, 'lastNameRu')
  const firstNameEn = _.get(data, 'firstNameEn')
  const lastNameEn = _.get(data, 'lastNameEn')
  const greetingRu = _.get(data, 'greetingRu')
  const greetingEn = _.get(data, 'greetingEn')
  const status = _.get(data, 'status')
  const password = _.get(data, 'password')
  const phoneNumber = _.get(data, 'phoneNumber')
  const photo = _.isObject(_.get(data, 'photo')) ? _.get(data, ['photo', 'id']) : _.get(data, 'photo')
  const groups = [_.get(data, ['role', 'value'])]
  const position = _.get(data, ['position', 'value'])
  return {
    email,
    password,
    'phone_number': phoneNumber,
    groups,
    position,
    status,
    photo,
    'first_name_ru': firstNameRu,
    'last_name_ru': lastNameRu,
    'first_name_en': firstNameEn,
    'last_name_en': lastNameEn,
    'greeting_text_ru': greetingRu,
    'greeting_text_en': greetingEn
  }
}

export const listFilterSerializer = (data) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering') || '-id'
  return {
    'manufacture': _.get(defaultData, 'manufacture'),
    'user_group': _.get(defaultData, 'group'),
    'search': _.get(defaultData, 'search'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize'),
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}

