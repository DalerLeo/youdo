import React from 'react'
import _ from 'lodash'
import {compose, pure} from 'recompose'
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
  OrderGridList
} from './components'
import {
  customerCreateAction,
  customerUpdateAction,
  customerListFetchAction,
  customerDeleteAction,
  customerItemFetchAction
} from './actions/order'
import {openErrorAction} from 'actions/error'

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
  customerCreateAction,
  customerUpdateAction,
  customerDeleteAction,
  openErrorAction
}

const mapStateToProps = () => ({})

const enhance = compose(
  listWrapper({
    except,
    storeName: 'order',
    listFetchAction: customerListFetchAction
  }),
  detailWrapper({
    storeName: 'order',
    itemFetchAction: customerItemFetchAction
  }),
  createWrapper({
    storeName: 'order',
    formName: 'CustomerCreateForm',
    createAction: customerCreateAction,
    queryKey: CUSTOMER_CREATE_DIALOG_OPEN,
    thenActionKey: CUSTOMER_MAIL_DIALOG_OPEN
  }),
  updateWrapper({
    updateKeys,
    createKeys,
    storeName: 'order',
    formName: 'CustomerCreateForm',
    updateAction: customerUpdateAction,
    queryKey: CUSTOMER_UPDATE_DIALOG_OPEN
  }),
  confirmWrapper({
    storeName: 'order',
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
  pure
)

const OrderList = enhance((props) => {
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
    updateDialog
  } = props
  const detailId = _.toInteger(_.get(params, 'id'))

  const confirmDialog = {
    confirmLoading: detailLoading,
    ...props.confirmDialog

  }

  const initialValues = {
    ...detail,
    master: _.get(detail, 'master.id'),
    district: _.get(detail, 'district.id')
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
      <OrderGridList
        filter={filter}
        listData={listData}
        detailData={detailData}
        createDialog={createDialog}
        confirmDialog={confirmDialog}
        updateDialog={{...updateDialog, initialValues}}
        filterDialog={filterDialog}
      />
    </Layout>
  )
})

export default OrderList
