import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import toBoolean from '../helpers/toBoolean'

const STATUS_ACTIVE = 1
const TWO = 2

export const createSerializer = (data, location, newClient) => {
    const name = _.get(data, 'name')
    const client = !newClient ? _.get(data, ['client', 'value']) : _.get(data, 'undefined')
    const newClientName = newClient ? _.get(data, ['newClientName']) : _.get(data, 'undefined')
    const marketType = _.get(data, ['marketType', 'value']) || _.get(data, ['marketTypeParent', 'value'])
    const address = _.get(data, 'address')
    const guide = _.get(data, 'guide')
    const frequency = _.get(data, ['frequency', 'value'])
    const status = _.get(data, ['status', 'value'])
    const lat = _.get(location, 'lat')
    const phones = _.filter(_.get(data, 'phones'), item => !_.isEmpty(item))
    const lon = _.get(location, 'lng')
    const contactName = _.get(data, ['contactName'])
    const isActive = status === STATUS_ACTIVE

    return {
        name,
        client,
        'market_type': marketType,
        address,
        guide,
        'visit_frequency': frequency,
        'contact_name': contactName,
        'location': {
            'lat': lat,
            'lon': lon
        },
        'is_active': isActive,
        'new_client_name': newClientName,
        okad: _.get(data, 'okad'),
        mfo: _.get(data, 'mfo'),
        inn: _.get(data, 'inn'),
        'bank_address': _.get(data, 'bankAddress'),
        'checking_account': _.get(data, 'checkingAccount'),
        phones
    }
}

export const updateSerializer = (data, location, detail) => {
    const client = _.get(detail, ['client', 'id'])
    const name = _.get(data, 'name')
    const clientName = _.get(data, 'client')
    const marketType = _.get(data, ['marketType', 'value']) || _.get(data, ['marketTypeParent', 'value'])
    const address = _.get(data, 'address')
    const guide = _.get(data, 'guide')
    const frequency = _.get(data, ['frequency', 'value'])
    const status = _.get(data, ['status', 'value'])
    const lat = _.get(location, 'lat')
    const lon = _.get(location, 'lng')
    const contactName = _.get(data, ['contactName'])
    const phones = _.filter(_.map(_.get(data, 'phones'), (phone) => {
        return {
            phone: phone.phone,
            id: phone.id
        }
    }), item => item.phone)

    const isActive = status === STATUS_ACTIVE

    return {
        name,
        'new_client_name': clientName,
        client,
        'market_type': marketType,
        address,
        guide,
        'visit_frequency': frequency,
        phones,
        'contact_name': contactName,
        'location': {
            'lat': lat,
            'lon': lon
        },
        'is_active': isActive,
        okad: _.get(data, 'okad'),
        mfo: _.get(data, 'mfo'),
        inn: _.get(data, 'inn'),
        'bank_address': _.get(data, 'bankAddress'),
        'checking_account': _.get(data, 'checkingAccount')
    }
}

export const imageSerializer = (image) => {
    return {
        'image': image,
        'is_primary': false
    }
}
export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const nullBorder = toBoolean(_.get(defaultData, 'nullBorder'))

    return {
        'client': _.get(defaultData, 'client') || null,
        'created_by': _.get(defaultData, 'createdBy') || null,
        'is_active': _.toNumber(_.get(defaultData, 'isActive')) === TWO ? false : _.get(defaultData, 'isActive'),
        'frequency': _.get(defaultData, 'frequency'),
        'border': _.get(defaultData, 'zone') || null,
        'market_type': _.get(defaultData, 'marketType') || _.get(defaultData, 'marketTypeParent') || null,
        'null_border': nullBorder ? 'True' : null,
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const multiUpdateSerializer = (data, markets) => {
    const marketType = _.get(data, ['marketType', 'value']) || _.get(data, ['marketTypeParent', 'value'])
    const responsibleAgent = _.get(data, ['responsibleAgent', 'value'])
    const status = _.get(data, ['status', 'value'])
    const isActive = status ? status === STATUS_ACTIVE : status
    return {
        markets: _.split(markets, '-'),
        responsible_agent: responsibleAgent,
        market_type: marketType,
        is_active: isActive
    }
}

