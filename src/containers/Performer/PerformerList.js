import React from 'react'
import _ from 'lodash'
import fp from 'lodash/fp'
import {compose, pure, mapPropsStream} from 'recompose'
import {connect} from 'react-redux'
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
  APPLICANT_CREATE_DIALOG_OPEN,
  APPLICANT_UPDATE_DIALOG_OPEN,
  APPLICANT_DELETE_DIALOG_OPEN,
  APPLICANT_FILTER_KEY,
  APPLICANT_FILTER_OPEN,
  PerformerGridList
} from './components'
import {
  applicantCreateAction,
  applicantUpdateAction,
  applicantListFetchAction,
  applicantDeleteAction,
  userOrderListFetchAction,
  applicantItemFetchAction
} from './actions/applicant'
import {getDataFromState} from 'helpers/get'

const updateKeys = {
  city: 'livingPlace.parent.id',
  email: 'email',
  speciality: 'speciality',
  fullName: 'fullName',
  photo: 'photo.file',
  district: 'livingPlace.id',
  phoneNumber: 'phoneNumber',
  numberPassport: 'numberPassport'
}
const createKeys = {
}
const except = {
  openMailDialog: null
}

const mapDispatchToProps = {
  userOrderListFetchAction
}

const mapStateToProps = (state) => ({
  orderList: getDataFromState('order.list', state)
})

const enhance = compose(
  listWrapper({
    except,
    storeName: 'applicant',
    name: 'performer',
    listFetchAction: applicantListFetchAction
  }),
  detailWrapper({
    storeName: 'applicant',
    itemFetchAction: applicantItemFetchAction
  }),
  createWrapper({
    storeName: 'applicant',
    formName: 'PerformerCreateForm',
    createAction: applicantCreateAction,
    queryKey: APPLICANT_CREATE_DIALOG_OPEN
  }),
  updateWrapper({
    updateKeys,
    createKeys,
    storeName: 'applicant',
    formName: 'PerformerCreateForm',
    updateAction: applicantUpdateAction,
    queryKey: APPLICANT_UPDATE_DIALOG_OPEN
  }),
  confirmWrapper({
    storeName: 'applicant',
    confirmAction: applicantDeleteAction,
    queryKey: APPLICANT_DELETE_DIALOG_OPEN,
    successMessage: 'Успешно удалено',
    failMessage: 'Удаление невозможно из-за связи с другими данными'
  }),
  filterWrapper({
    queryKey: APPLICANT_FILTER_OPEN,
    filterKeys: APPLICANT_FILTER_KEY
  }),
  connect(mapStateToProps, mapDispatchToProps),
  mapPropsStream(props$ => {
    props$
      .distinctUntilChanged(null, fp.get('params.id'))
      .filter(fp.get('params.id'))
      .subscribe(props => props.userOrderListFetchAction(props.filter, {master: _.get(props, 'params.id')}))
    return props$
  }),
  pure
)

const PerformerList = enhance((props) => {
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
      <PerformerGridList
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

export default PerformerList
