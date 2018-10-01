import React from 'react'
import _ from 'lodash'
import {compose, withHandlers, pure, withState} from 'recompose'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../../components/Layout'
import * as actionType from '../../../constants/actionTypes'
import {
  listWrapper,
  detailWrapper,
  createWrapper,
  updateWrapper,
  confirmWrapper,
  filterWrapper
} from '../../Wrappers'
import {replaceUrl} from '../../../helpers/changeUrl'
import {updateDetailStore, updateStore} from '../../../helpers/updateStore'
import toBoolean from '../../../helpers/toBoolean'
import toCamelCase from '../../../helpers/toCamelCase'
import {
  APPLICANT_CREATE_DIALOG_OPEN,
  APPLICANT_UPDATE_DIALOG_OPEN,
  APPLICANT_DELETE_DIALOG_OPEN,
  APPLICANT_FILTER_KEY,
  APPLICANT_FILTER_OPEN,
  APPLICANT_MAIL_DIALOG_OPEN,
  ApplicantGridList
} from '../../../components/Applicant'
import {
  applicantCreateAction,
  applicantUpdateAction,
  applicantListFetchAction,
  applicantDeleteAction,
  applicantItemFetchAction
} from '../../../actions/Administration/applicant'
import {openSnackbarAction} from '../../../actions/snackbar'
import {openErrorAction} from '../../../actions/error'
import t from '../../../helpers/translate'

const updateKeys = {
  activityField: 'activityField.id',
  address: 'address',
  balance: 'balance',
  birthday: 'birthday',
  countryCode: 'countryCode',
  email: 'email',
  fullName: 'fullName',
  gender: 'gender',
  image: 'image',
  interestLevel: 'interestLevel',
  martialStatus: 'martialStatus.id',
  phone: 'phone',
  phoneCode: 'phoneCode',
  profileLanguage: 'profileLanguage',
  status: 'status'
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

const mapStateToProps = () => ({})

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

  withHandlers({

    handleCloseMailDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[APPLICANT_MAIL_DIALOG_OPEN]: false})})
    },
    handleSubmitUpdateDialog: props => (fieldNames) => {
      const {updateForm, detail, list} = props
      let data = {}

      _.map(fieldNames, name => {
        const formValue = _.get(updateForm, ['values', name, 'value'])
        if (formValue && detail[name] !== formValue) data[name] = formValue
      })

      if (!_.isEmpty(data)) {
        const id = _.toInteger(_.get(props, ['params', 'id']))
        return props.applicantUpdateAction(id, data)
          .then(({value}) => {
            const formedValue = toCamelCase(value)
            props.updateDetailStore(actionType.APPLICANT_ITEM, formedValue)
            return props.updateStore(id, list, actionType.APPLICANT_LIST, {
              firstName: _.get(formedValue, 'firstName'),
              lastName: _.get(formedValue, 'lastName'),
              secondName: _.get(formedValue, 'secondName'),
              resumeNum: _.get(formedValue, 'resumeNum'),
              updatedAt: _.get(formedValue, 'updatedAt'),
              balance: _.get(formedValue, 'balance')
            })
          })
          .then(() => openSnackbarAction({message: t('Успешно сохранено')}))
          .catch(error => props.openErrorAction({message: error}))
      }
      return null
    },

    handleSubmitCommentDialog: props => () => {
      const {commentForm} = props
      return props.applicantSendCommentAction(_.get(commentForm, 'values'))
        .then(() => props.openSnackbarAction({message: t('Успешно отправлено')}))
        .catch(error => props.openErrorAction({message: error}))
    },
    handleSubmitResetPasswordDialog: props => (id) => {
      const {filter, location} = props
      const params = {[APPLICANT_MAIL_DIALOG_OPEN]: true}
      return props.applicantSendCommentAction(id)
        .then(() => props.openSnackbarAction({message: t('Успешно отправлено')}))
        .then(() => replaceUrl(filter, location.pathname, params))
        .catch(error => props.openErrorAction({message: error}))
    },
    handleSubmitRechargeDialog: props => () => {
      const {rechargeForm} = props
      return props.applicantRechargeAction(_.get(rechargeForm, 'values'))
        .then(() => props.openSnackbarAction({message: t('Баланс успешно пополнен')}))
        .catch(error => props.openErrorAction({message: error}))
    }
  }),
  withState('openActionDialog', 'setOpenActionDialog', ''),
  pure
)

const ApplicantList = enhance((props) => {
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
  const openConfirmMailDialog = toBoolean(_.get(location, ['query', APPLICANT_MAIL_DIALOG_OPEN]))

  const detailId = _.toInteger(_.get(params, 'id'))

  const confirmDialog = {
    confirmLoading: detailLoading,
    openActionDialog: props.openActionDialog,
    setOpenActionDialog: props.setOpenActionDialog,
    handleSubmitResetPasswordDialog: props.handleSubmitResetPasswordDialog,
    handleSubmitRechargeDialog: props.handleSubmitRechargeDialog,
    ...props.confirmDialog

  }

  const confirmMailDialog = {
    open: openConfirmMailDialog,
    handleClose: props.handleCloseMailDialog
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
      <ApplicantGridList
        filter={filter}
        listData={listData}
        detailData={detailData}
        createDialog={createDialog}
        confirmDialog={confirmDialog}
        updateDialog={updateDialog}
        filterDialog={filterDialog}
        confirmMailDialog={confirmMailDialog}
      />
    </Layout>
  )
})

export default ApplicantList
