import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data) => {
  const email = _.get(data, 'email')
  const firstName = _.get(data, 'firstNameRu')
  const lastName = _.get(data, 'lastNameRu')
  const status = _.get(data, 'status')
  const martialStatus = _.get(data, 'martialStatus')
  const sphere = _.get(data, 'sphere')
  const birthDate = _.get(data, 'birthDate')
  const address = _.get(data, 'address')
  const phoneNumber = _.get(data, 'phoneNumber')
  const gender = _.get(data, 'gender')
  const lang = _.get(data, 'lang')
  const photo = _.isObject(_.get(data, 'photo')) ? _.get(data, ['photo', 'id']) : _.get(data, 'photo')
  const groups = [_.get(data, ['role', 'value'])]
  const position = _.get(data, ['position', 'value'])
  return {
    email,
    'phone_number': phoneNumber,
    groups,
    position,
    status,
    photo,
    'first_name': firstName,
    'last_name': lastName,
    address,
    'country_code': 'countryCode',
    sphere,
    'martial_status': martialStatus,
    'birth_date': birthDate,
    gender,
    lang
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

