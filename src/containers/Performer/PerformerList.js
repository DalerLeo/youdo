import React from 'react'
import _ from 'lodash'
import {compose, pure} from 'recompose'
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
import {updateDetailStore, updateStore} from 'helpers/updateStore'
import {
  APPLICANT_CREATE_DIALOG_OPEN,
  APPLICANT_UPDATE_DIALOG_OPEN,
  APPLICANT_DELETE_DIALOG_OPEN,
  APPLICANT_FILTER_KEY,
  APPLICANT_FILTER_OPEN,
  APPLICANT_MAIL_DIALOG_OPEN,
  PerformerGridList
} from './components'
import {
  applicantCreateAction,
  applicantUpdateAction,
  applicantListFetchAction,
  applicantDeleteAction,
  applicantItemFetchAction
} from './actions/applicant'
import {openErrorAction} from 'actions/error'

const updateKeys = {
  city: 'city',
  email: 'email',
  fullName: 'fullName',
  image: 'image',
  district: 'district',
  phoneNumber: 'phoneNumber'
}
const createKeys = {
  experiences: [{}],
  educations: [{}]
}
const except = {
  openMailDialog: null
}

const mapDispatchToProps = {
  applicantCreateAction,
  applicantUpdateAction,
  applicantDeleteAction,
  updateDetailStore,
  updateStore,
  openErrorAction
}

const mapStateToProps = (state) => ({spheres: _.get(state, 'spheres.data')})

const enhance = compose(
  listWrapper({
    except,
    storeName: 'applicant',
    listFetchAction: applicantListFetchAction
  }),
  detailWrapper({
    storeName: 'applicant',
    itemFetchAction: applicantItemFetchAction
  }),
  createWrapper({
    storeName: 'applicant',
    formName: 'ApplicantCreateForm',
    createAction: applicantCreateAction,
    queryKey: APPLICANT_CREATE_DIALOG_OPEN,
    thenActionKey: APPLICANT_MAIL_DIALOG_OPEN
  }),
  updateWrapper({
    updateKeys,
    createKeys,
    storeName: 'applicant',
    formName: 'ApplicantCreateForm',
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
  pure
)

const PerformerList = enhance((props) => {
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
    updateDialog
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
        filterDialog={filterDialog}
      />
    </Layout>
  )
})

export default PerformerList
