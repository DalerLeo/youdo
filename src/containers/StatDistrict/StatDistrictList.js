import React from 'react'
import _ from 'lodash'
import {compose, mapPropsStream} from 'recompose'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {
  listWrapper
} from '../Wrappers'
import {
  StatDistrictGridList
} from './components'
import {
  statServiceListFetchAction,
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
  connect(mapStateToProps, mapDispatchToProps),
  mapPropsStream(props$ => {
    props$
      .first()
      .subscribe(props => props.statBrandListFetchAction(props.filter))

    return props$
  }),
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
