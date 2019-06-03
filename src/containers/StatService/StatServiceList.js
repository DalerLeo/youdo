import React from 'react'
import _ from 'lodash'
import {compose, mapPropsStream} from 'recompose'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {
  listWrapper,
  filterWrapper
} from '../Wrappers'
import {
  CUSTOMER_FILTER_KEY,
  CUSTOMER_FILTER_OPEN,
  StatServiceGridList
} from './components'
import {
  statServiceListFetchAction,
  statOrderListFetchAction,
  regionListFetchAction
} from './actions/statService'
import {openErrorAction} from 'actions/error'
import {compareFilterByProps, getDataFromState} from '../../helpers/get'

const except = {}

const mapDispatchToProps = {
  openErrorAction,
  statServiceListFetchAction,
  regionListFetchAction
}

const mapStateToProps = (state) => ({
  statData: getDataFromState('statService.list', state),
  regionData: getDataFromState('region.list', state)
})

const enhance = compose(
  listWrapper({
    except,
    storeName: 'order',
    listFetchAction: statOrderListFetchAction
  }),
  filterWrapper({
    queryKey: CUSTOMER_FILTER_OPEN,
    filterKeys: CUSTOMER_FILTER_KEY
  }),
  connect(mapStateToProps, mapDispatchToProps),
  mapPropsStream(props$ => {
    props$
      .distinctUntilChanged(compareFilterByProps({}))
      .subscribe(props => {
        return props.statServiceListFetchAction(props.filter)
      })

    props$
      .first()
      .subscribe(props => props.regionListFetchAction())

    return props$
  }),
)

const StatServiceList = enhance((props) => {
  const {
    list,
    listLoading,
    detail,
    detailLoading,
    filter,
    layout,
    params,
    filterDialog,
    statData,
    regionData
  } = props
  const detailId = _.toInteger(_.get(params, 'id'))

  const data = _.map(_.get(statData, 'data'), item => {
    return {
      name: _.get(item, 'service.title'),
      y: _.get(item, 'count')
    }
  })
  const statLoading = _.get(statData, 'loading')
  const regionId = _.toInteger(filter.getParam('district'))
  const listData = {
    data: _.get(list, 'results'),
    listLoading,
    regionName: _.get(_.find(_.get(regionData, 'list'), {id: regionId}), 'name')
  }
  const detailData = {
    id: detailId,
    data: detail,
    detailLoading
  }

  return (
    <Layout {...layout}>
      <StatServiceGridList
        filter={filter}
        data={data}
        statLoading={statLoading}
        listData={listData}
        detailData={detailData}
        filterDialog={filterDialog}
      />
    </Layout>
  )
})

export default StatServiceList
