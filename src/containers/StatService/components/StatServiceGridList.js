import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import * as ROUTES from 'constants/routes'
import Container from 'components/Container'
import PieChart from './PieChart'
import SubMenu from 'components/SubMenu'
import defaultPropTypes from 'constants/propTypes'
import numberFormat from 'helpers/numberFormat'
import GridListNavPagination from 'components/GridList/GridListNavPagination/GridListNavPagination'
import RowColumnList from 'components/Utils/RowColumnList'
import StatDates from 'components/Utils/StatDates'
import StatRegion from 'components/Utils/StatRegion'
import deepPure from 'helpers/deepPure'

const enhance = compose(
  injectSheet({
    wrapper: {
      height: 'calc(100% + 28px)',
      background: '#fff',
      margin: '0 -30px',
      padding: '0 30px'
    },
    addButton: {
      '& svg': {
        width: '14px !important',
        height: '14px !important'
      }
    },
    rightPanel: {
      background: '#fff',
      flexBasis: '100%',
      width: '100%',
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    iconBtn: {
      display: 'flex',
      justifyContent: 'flex-end',
      transition: 'all 200ms ease-out'
    },
    listRow: {
      margin: '0 -30px !important',
      width: 'auto !important',
      padding: '0 30px',
      '& > div': {
        overflow: 'hidden',
        wordBreak: 'normal',
        textOverflow: 'ellipsis',
        '&:last-child': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }

      }
    },
    link: {
      cursor: 'pointer',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: '1'
    },
    titleWrap: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      color: '#333333',
      fontSize: '18px'
    }

  }),
  deepPure
)
const orderProps = [
  {xs: '2', path: 'customer.fullName', title: 'Клиент'},
  {xs: '2', path: 'master.fullName', title: 'Мастер'},
  {xs: '2', path: 'totalPrice', title: 'Обшая Сумма', func: numberFormat}
]
const StatServiceGridList = enhance((props) => {
  const {
    filter,
    listData,
    data,
    statLoading,
    classes
  } = props
  const orderList = _.get(listData, 'data')
  const fromDate = filter.getParam('fromDate')
  const toDate = filter.getParam('toDate')
  const district = _.toInteger(filter.getParam('district'))
  return (
    <Container>
      <div className={classes.wrapper}>
        <SubMenu url={ROUTES.STAT_SERVICE_LIST_URL}/>
        <div className={classes.titleWrap}>
          <StatDates filter={filter} initialValues={{dates: {toDate, fromDate}}}/>
          <span className={classes.title}>Фактические продажи по услугам</span>
          <StatRegion filter={filter} initialValues={{district: {value: district}}}/>
        </div>
        <PieChart loading={statLoading} data={data}/>
        <GridListNavPagination filter={filter}/>
        <RowColumnList filter={filter} detailPath={ROUTES.ORDER_ITEM_PATH} list={orderList} properties={orderProps}/>
      </div>

    </Container>
  )
})

StatServiceGridList.propTypes = {
  filter: PropTypes.object.isRequired,
  listData: PropTypes.object,
  detailData: PropTypes.object,
  filterDialog: PropTypes.shape({
    initialValues: PropTypes.object,
    ...defaultPropTypes
  }).isRequired
}

export default StatServiceGridList
