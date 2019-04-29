import React from 'react'
import _ from 'lodash'
import {compose, pure, withHandlers} from 'recompose'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from 'components/Layout'
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
  orderCreateAction,
  customerUpdateAction,
  orderListFetchAction,
  customerDeleteAction,
  customerItemFetchAction
} from './actions/order'
import {customerCreateAction} from 'containers/Customer/actions/custormer'
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
  openErrorAction
}

const mapStateToProps = () => ({})

const enhance = compose(
  listWrapper({
    except,
    storeName: 'order',
    listFetchAction: orderListFetchAction
  }),
  detailWrapper({
    storeName: 'order',
    itemFetchAction: customerItemFetchAction
  }),
  createWrapper({
    storeName: 'order',
    formName: 'CustomerCreateForm',
    createAction: orderCreateAction,
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
  withHandlers({
    onOrder: props => () => {
      const {createForm} = props
      const formValues = _.get(createForm, ['values'])
      if (_.get(formValues, 'fullName')) {
        return props.customerCreateAction(formValues)
          .then(({value}) => props.createAction({...formValues, customer: {value: value.id}}))
          .then(() => props.listFetchAction(props.filter))
          .then(() => hashHistory.push('/order'))
      }
      return props.createAction(formValues)
        .then(() => props.listFetchAction(props.filter))
        .then(() => hashHistory.push('/order'))
    }
  }),
  pure
)

const OrderList = enhance((props) => {
  const {
    location,
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
    onOrder
  } = props
  const detailId = _.toInteger(_.get(params, 'id'))

  const confirmDialog = {
    confirmLoading: detailLoading,
    ...props.confirmDialog

  }
  const orderService = _.map(detail.orderService, item => {
    return {
      amount: _.get(item, 'amount'),
      price: _.get(item, 'price'),
      brand: {value: _.get(item, 'brand.id'), text: _.get(item, 'brand.title')},
      service: {
        value: _.get(item, 'service.id'),
        text: _.get(item, 'service.name'),
        price: _.get(item, 'service.price')
      }
      //    Brand: {value: _.get(item, 'brand')},
      //    Brand: {value: _.get(item, 'brand')},
    }
  })
  const initialValues = {
    ...detail,
    master: {value: _.get(detail, 'master.id')},
    customer: {value: _.get(detail, 'customer.id')},
    district: {value: _.get(detail, 'district.id')},
    status: {value: _.get(detail, 'status') || 'unconfirmed'},
    services: orderService
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

  const createInitial = {
    customer: {value: _.toInteger(_.get(location, 'query.clientName'))}
  }
  return (
    <Layout {...layout}>
      <OrderGridList
        filter={filter}
        listData={listData}
        detailData={detailData}
        createDialog={{...createDialog, initialValues: createInitial, onSubmit: onOrder}}
        confirmDialog={confirmDialog}
        updateDialog={{...updateDialog, initialValues}}
        filterDialog={filterDialog}
      />
    </Layout>
  )
})

export default OrderList
