import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])
    const code = _.get(data, 'code')
    const priority = _.get(data, 'priority')
    const type = _.get(data, ['type', 'value']) || _.get(data, ['productTypeParent', 'value'])
    const measurement = _.get(data, ['measurement', 'value', 'id'])
    const boxes = _.filter(_.map(_.get(data, 'boxes'), (item, index) => {
        return {
            measurement: index,
            amount: _.toNumber(_.get(item, 'amount'))
        }
    }), item => _.get(item, 'amount'))
    const image = _.get(data, 'image')
    const imageId = (_.get(image, ['id'])) ? _.get(image, ['id']) : image
    const requset = {
        name,
        code,
        type,
        priority,
        measurement,
        boxes
    }
    return image ? _.merge(requset, {image: imageId}) : requset
}

export const listFilterSerializer = (data, manufacture) => {
    const {...defaultData} = data
    const type = _.get(defaultData, 'typeChild') || _.get(defaultData, 'typeParent')
    const ordering = _.get(data, 'ordering')

    return {
        'manufacture': manufacture,
        'brand': _.get(defaultData, 'brand'),
        type,
        'measurement': _.get(defaultData, 'measurement'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

