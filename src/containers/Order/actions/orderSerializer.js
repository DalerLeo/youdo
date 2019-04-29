import _ from 'lodash'
import {orderingSnakeCase} from '../../../helpers/serializer'
import toSnakeCase from '../../../helpers/toSnakeCase'

export const createSerializer = (data) => {
  const address = _.get(data, ['address'])
  const customer = _.get(data, 'customer.value')
  const status = _.get(data, 'status.value')
  const master = _.get(data, 'master.value')
  const district = _.get(data, 'district.value')
  const orderService = _.map(_.get(data, ['services']), service => {
    return {
      service: service.service.value,
      brand: service.brand.value,
      amount: service.amount
    }
  })
  const phoneNumber = _.get(data, ['phoneNumber'])
  return toSnakeCase({
    phoneNumber,
    address,
    customer,
    master,
    district,
    orderService,
    status
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

export const listFilterSerializer = (data, date) => {
  const {...defaultData} = data
  const ordering = _.get(data, 'ordering') || '-id'
  return {
    ...date,
    'manufacture': _.get(defaultData, 'manufacture'),
    'district': _.get(defaultData, 'district'),
    'user_group': _.get(defaultData, 'group'),
    'search': _.get(defaultData, 'search'),
    'page': _.get(defaultData, 'page'),
    'page_size': _.get(defaultData, 'pageSize'),
    'ordering': ordering && orderingSnakeCase(ordering)
  }
}

