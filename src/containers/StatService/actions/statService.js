import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../../../helpers/axios'
import * as API from '../../../constants/api'
import * as actionTypes from '../../../constants/actionTypes'
import * as serializers from './statServiceSerializer'

export const statServiceListFetchAction = (filter) => {
  const params = serializers.listFilterSerializer(filter.getParams())

  const payload = axios()
    .get(API.STAT_SERVICE_LIST, {params})
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

export const statOrderListFetchAction = (filter, date) => {
  const params = serializers.listFilterSerializer(filter.getParams())

  const payload = axios()
    .get(API.ORDER_LIST, {params})
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.ORDER_LIST,
    payload
  }
}

export const regionListFetchAction = () => {
  const payload = axios()
    .get(API.REGIONS_LIST)
    .then((response) => {
      return _.get(response, 'data')
    })
    .catch((error) => {
      return Promise.reject(_.get(error, ['response', 'data']))
    })

  return {
    type: actionTypes.REGIONS_LIST,
    payload
  }
}
