import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../../helpers/axios'
import * as API from '../../../constants/api'
import * as actionTypes from '../../../constants/actionTypes'
import * as serializers from './statDistrictSerializer'

export const statServiceListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())

  const payload = axios()
    .get(API.STAT_DISTRICT_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.STAT_SERVICE_LIST,
    payload
  }
}
export const statBrandListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())

  const payload = axios()
    .get(API.STAT_BRAND_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.STAT_BRAND_LIST,
    payload
  }
}

export const statServiceItemFetchAction = (id) => {
  const payload = axios()
    .get(sprintf(API.STAT_SERVICE_ITEM, id))
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.STAT_SERVICE_ITEM,
    payload
  }
}
