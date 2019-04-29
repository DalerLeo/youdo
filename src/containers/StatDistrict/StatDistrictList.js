import React from 'react'
import _ from 'lodash'
import {compose, pure, mapPropsStream} from 'recompose'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {
  listWrapper,
  detailWrapper,
  filterWrapper
} from '../Wrappers'
import {
  CUSTOMER_FILTER_KEY,
  CUSTOMER_FILTER_OPEN,
  StatDistrictGridList
} from './components'
import {
  statServiceListFetchAction,
  statServiceItemFetchAction,
  statBrandListFetchAction
} from './actions/statDistrict'
import {openErrorAction} from 'actions/error'

import {getDataFromState} from 'helpers/get'
const except = {}

const mapDispatchToProps = {
  openErrorAction,
  statBrandListFetchAction
}

const mapStateToProps = (state) => ({brandList: getDataFromState('statBrand.list', state)})

const enhance = compose(
  listWrapper({
    except,
    storeName: 'statService',
    listFetchAction: statServiceListFetchAction
  }),
  detailWrapper({
    storeName: 'order',
    itemFetchAction: statServiceItemFetchAction
  }),
  filterWrapper({
    queryKey: CUSTOMER_FILTER_OPEN,
    filterKeys: CUSTOMER_FILTER_KEY
  }),
  connect(mapStateToProps, mapDispatchToProps),
  mapPropsStream(props$ => {
    props$
      .first()
      .subscribe(props => props.statBrandListFetchAction(props.filter))

    return props$
  }),
  pure
)

const StatDistrictList = enhance((props) => {
  const {
    list,
    listLoading,
    layout,
    brandList
  } = props

  const data = _.map(list, item => {
    return {
      name: _.get(item, 'district.title'),
      y: _.get(item, 'count'),
      districtID: _.get(item, 'district.id')
    }
  })

  const brandData = _.map(brandList.data, item => {
    return {
      name: _.get(item, 'brand.title'),
      y: _.get(item, 'count'),
      brandID: _.get(item, 'brand.id')
    }
  })

  const listData = {
    data: data,
    listLoading
  }
  const brandListData = {
    data: brandData,
    laoding: _.get(brandList, 'loading')
  }

  return (
    <Layout {...layout}>
      <StatDistrictGridList
        listData={listData}
        brandListData={brandListData}
      />
    </Layout>
  )
})

export default StatDistrictList
