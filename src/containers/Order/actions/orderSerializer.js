import _ from 'lodash'
import {orderingSnakeCase} from '../../../helpers/serializer'
import toSnakeCase from '../../../helpers/toSnakeCase'

export const createSerializer = (data) => {
  const address = _.get(data, ['address'])
  const clientName = _.get(data, ['clientName'])
  const master = _.get(data, ['master'])
  const district = _.get(data, ['district'])
  const services = _.map(_.get(data, ['services']), service => service.id)
  const phoneNumber = _.get(data, ['phoneNumber'])
  return toSnakeCase({
    phoneNumber,
    address,
    clientName,
    master,
    district,
    services
  })
}

export const updateSerializer = (data) => {
  const email = _.get(data, 'email')
  const firstName = _.get(data, 'firstName')
  const lastName = _.get(data, 'lastName')
  const secondName = _.get(data, 'secondName')
  const status = _.get(data, ['status', 'value'])
  const activityField = _.get(data, ['activityField'])
  const interestLevel = _.get(data, ['interestLevel'])
  const martialStatus = _.get(data, ['martialStatus'])
  const sphere = _.get(data, ['sphere', 'value'])
  const birthday = _.get(data, 'birthday')
  const address = _.get(data, 'address')
  const phone = _.get(data, 'phone')
  const gender = _.get(data, ['gender'])
  const lang = _.get(data, ['profileLanguage'])
  const phoneCode = _.get(data, ['phoneCode'])
  const image = _.isObject(_.get(data, 'image')) ? _.get(data, ['image', 'id']) : _.get(data, 'image')
  return {
    email,
    status,
    image,
    address,
    sphere,
    gender,
    birthday,
    'second_name': secondName,
    'first_name': firstName,
    'last_name': lastName,
    'phone_code': phoneCode,
    'martial_status': martialStatus,
    'phone': phone,
    'interested_level': interestLevel,
    'activity_field': activityField,
    'profile_language': lang
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

