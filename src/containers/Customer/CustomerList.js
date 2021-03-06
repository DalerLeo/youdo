import React from 'react'
import _ from 'lodash'
import {compose, mapPropsStream, pure} from 'recompose'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {
  listWrapper,
  detailWrapper,
  createWrapper,
  updateWrapper,
  confirmWrapper,
  filterWrapper
} from '../Wrappers'
import {
  CUSTOMER_CREATE_DIALOG_OPEN,
  CUSTOMER_UPDATE_DIALOG_OPEN,
  CUSTOMER_DELETE_DIALOG_OPEN,
  CUSTOMER_FILTER_KEY,
  CUSTOMER_FILTER_OPEN,
  CUSTOMER_MAIL_DIALOG_OPEN,
  CustomerGridList
} from './components'
import {
  customerCreateAction,
  customerUpdateAction,
  customerListFetchAction,
  customerDeleteAction,
  customerItemFetchAction
} from './actions/custormer'
import fp from 'lodash/fp'
import {userOrderListFetchAction} from 'containers/Performer/actions/applicant'
import {getDataFromState} from '../../helpers/get'
const updateKeys = {
  fullName: 'fullName',
  phoneNumber: 'phoneNumber',
  email: 'email',
  photo: 'photo'
}
const createKeys = {
}
const except = {}

const mapDispatchToProps = {
  userOrderListFetchAction
}
const mapStateToProps = (state) => ({
  orderList: getDataFromState('order.list', state)
})
const enhance = compose(
  listWrapper({
    except,
    storeName: 'customer',
    listFetchAction: customerListFetchAction
  }),
  detailWrapper({
    storeName: 'customer',
    itemFetchAction: customerItemFetchAction
  }),
  createWrapper({
    storeName: 'customer',
    formName: 'CustomerCreateForm',
    createAction: customerCreateAction,
    queryKey: CUSTOMER_CREATE_DIALOG_OPEN,
    thenActionKey: CUSTOMER_MAIL_DIALOG_OPEN
  }),
  updateWrapper({
    updateKeys,
    createKeys,
    storeName: 'customer',
    formName: 'CustomerCreateForm',
    updateAction: customerUpdateAction,
    queryKey: CUSTOMER_UPDATE_DIALOG_OPEN
  }),
  confirmWrapper({
    storeName: 'customer',
    confirmAction: customerDeleteAction,
    queryKey: CUSTOMER_DELETE_DIALOG_OPEN,
    successMessage: 'Успешно удалено',
    failMessage: 'Удаление невозможно из-за связи с другими данными'
  }),
  filterWrapper({
    queryKey: CUSTOMER_FILTER_OPEN,
    filterKeys: CUSTOMER_FILTER_KEY
  }),
  connect(mapStateToProps, mapDispatchToProps),
  mapPropsStream(props$ => {
    props$
      .distinctUntilChanged(null, fp.get('params.id'))
      .filter(fp.get('params.id'))
      .subscribe(props => props.userOrderListFetchAction(props.filter, {customer: _.get(props, 'params.id')}))
    return props$
  }),
  pure
)

const CustomerList = enhance((props) => {
  const {
    list,
    listLoading,
    detail,
    detailLoading,
    filter,
    layout,
    params,
    filterDialog,
    createDialog,
    updateDialog,
    orderList
  } = props
  const detailId = _.toInteger(_.get(params, 'id'))

  const confirmDialog = {
    confirmLoading: detailLoading,
    ...props.confirmDialog

  }

  const listData = {
    data: _.get(list, 'results'),
    listLoading
  }
  const detailData = {
    id: detailId,
    data: detail,
    detailLoading
  }

  return (
    <Layout {...layout}>
      <CustomerGridList
        filter={filter}
        listData={listData}
        detailData={detailData}
        createDialog={createDialog}
        confirmDialog={confirmDialog}
        updateDialog={updateDialog}
        orderList={orderList}
        filterDialog={filterDialog}
      />
    </Layout>
  )
})

export default CustomerList
