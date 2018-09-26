import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {compose, withHandlers, pure, withState} from 'recompose'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../../components/Layout'
import * as ROUTER from '../../../constants/routes'
import * as actionType from '../../../constants/actionTypes'
import {listWrapper, detailWrapper, createWrapper} from '../../Wrappers'
import {replaceUrl} from '../../../helpers/changeUrl'
import {updateDetailStore, updateStore} from '../../../helpers/updateStore'
import toBoolean from '../../../helpers/toBoolean'
import toCamelCase from '../../../helpers/toCamelCase'
import moment from 'moment'
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

const mapStateToProps = (state, props) => {
  const updateLoading = _.get(state, ['applicant', 'update', 'loading'])
  const filterForm = _.get(state, ['form', 'ApplicantFilterForm'])
  const updateForm = _.get(state, ['form', 'ApplicantUpdateForm'])
  return {
    updateLoading,
    filterForm,
    updateForm
  }
}

const enhance = compose(
  listWrapper({listFetchAction: applicantListFetchAction, storeName: 'applicant', except}),
  detailWrapper({itemFetchAction: applicantItemFetchAction, storeName: 'applicant'}),
  createWrapper({
    createAction: applicantCreateAction,
    queryKey: APPLICANT_CREATE_DIALOG_OPEN,
    storeName: 'applicant',
    formName: 'ApplicantCreateForm',
    thenActionKey: APPLICANT_MAIL_DIALOG_OPEN
  }),
  connect(mapStateToProps, mapDispatchToProps),

  withHandlers({
    handleOpenConfirmDialog: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.APPLICANT_ITEM_PATH, id),
        query: filter.getParams({[APPLICANT_DELETE_DIALOG_OPEN]: true})
      })
    },

    handleCloseConfirmDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[APPLICANT_DELETE_DIALOG_OPEN]: false})})
    },
    handleDeleteConfirmDialog: props => () => {
      const {detail, filter, location: {pathname}} = props
      props.applicantDeleteAction(detail.id)
        .then(() => {
          hashHistory.push({pathname, query: filter.getParams({[APPLICANT_DELETE_DIALOG_OPEN]: false})})
          props.listFetchAction(filter)
          return props.openSnackbarAction({message: t('Успешно удалено')})
        })
        .catch(() => props.openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
    },

    handleOpenFilterDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[APPLICANT_FILTER_OPEN]: true})})
    },

    handleCloseFilterDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[APPLICANT_FILTER_OPEN]: false})})
    },
    handleCloseMailDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[APPLICANT_MAIL_DIALOG_OPEN]: false})})
    },
    handleClearFilterDialog: props => () => {
      const {location: {pathname}} = props
      hashHistory.push({pathname, query: {}})
    },

    handleSubmitFilterDialog: props => () => {
      const {filter, filterForm} = props
      const manufacture = _.get(filterForm, ['values', 'manufacture']) || null
      const group = _.get(filterForm, ['values', 'group']) || null
      const fromDate = _.get(filterForm, ['values', 'date', 'startDate']) || null
      const toDate = _.get(filterForm, ['values', 'date', 'endDate']) || null
  
      filter.filterBy({
        [APPLICANT_FILTER_OPEN]: false,
        [APPLICANT_FILTER_KEY.MANUFACTURE]: _.join(manufacture, '-'),
        [APPLICANT_FILTER_KEY.GROUP]: _.join(group, '-'),
        [APPLICANT_FILTER_KEY.START_DATE]: fromDate && fromDate.format('YYYY-MM-DD'),
        [APPLICANT_FILTER_KEY.END_DATE]: toDate && toDate.format('YYYY-MM-DD'),
      })
    },

    handleOpenDeleteDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({
        pathname,
        query: filter.getParams({openDeleteDialog: 'yes'})
      })
    },

    handleCloseDeleteDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({openDeleteDialog: false})})
    },
    handleOpenUpdateDialog: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.APPLICANT_ITEM_PATH, id),
        query: filter.getParams({[APPLICANT_UPDATE_DIALOG_OPEN]: true})
      })
    },

    handleCloseUpdateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[APPLICANT_UPDATE_DIALOG_OPEN]: false})})
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
    updateLoading,
    filter,
    layout,
    params
  } = props
  const openFilterDialog = toBoolean(_.get(location, ['query', APPLICANT_FILTER_OPEN]))
  const openCreateDialog = toBoolean(_.get(location, ['query', APPLICANT_CREATE_DIALOG_OPEN]))
  const openUpdateDialog = toBoolean(_.get(location, ['query', APPLICANT_UPDATE_DIALOG_OPEN]))
  const openConfirmDialog = toBoolean(_.get(location, ['query', APPLICANT_DELETE_DIALOG_OPEN]))
  const openConfirmMailDialog = toBoolean(_.get(location, ['query', APPLICANT_MAIL_DIALOG_OPEN]))
  const firstDayOfMonth = _.get(location, ['query', 'startDate']) || moment().format('YYYY-MM-01')
  const lastDay = moment().daysInMonth()
  const lastDayOfMonth = _.get(location, ['query', 'endDate']) || moment().format('YYYY-MM-' + lastDay)
  
  const manufacture = _.toInteger(filter.getParam(APPLICANT_FILTER_KEY.MANUFACTURE))
  const group = _.toInteger(filter.getParam(APPLICANT_FILTER_KEY.GROUP))
  const detailId = _.toInteger(_.get(params, 'id'))

  const actionsDialog = {
    handleActionEdit: props.handleActionEdit,
    handleActionDelete: props.handleOpenDeleteDialog
  }

  const createDialog = {
    openCreateDialog,
    ...props.createDialog
  }
  const confirmDialog = {
    confirmLoading: detailLoading,
    openConfirmDialog,
    handleOpenConfirmDialog: props.handleOpenConfirmDialog,
    handleCloseConfirmDialog: props.handleCloseConfirmDialog,
    handleDeleteConfirmDialog: props.handleDeleteConfirmDialog,
    openActionDialog: props.openActionDialog,
    setOpenActionDialog: props.setOpenActionDialog,
    handleSubmitResetPasswordDialog: props.handleSubmitResetPasswordDialog,
    handleSubmitRechargeDialog: props.handleSubmitRechargeDialog

  }
  const updateDialog = {
    initialValues: (() => {
      if (!detail || openCreateDialog) {
        return {}
      }
      return {
        activityField: {value: _.get(detail, ['activityField', 'id'])},
        address: _.get(detail, 'address'),
        balance: _.get(detail, 'balance'),
        birthday: _.get(detail, 'birthday'),
        countryCode: _.get(detail, 'countryCode'),
        email: _.get(detail, 'email'),
        firstName: _.get(detail, 'firstName'),
        gender: {value: _.get(detail, ['gender'])},
        image: _.get(detail, 'image'),
        interestLevel: _.get(detail, 'interestLevel'),
        lastName: _.get(detail, 'lastName'),
        martialStatus: {value: _.get(detail, ['martialStatus', 'id'])},
        phone: _.get(detail, 'phone'),
        phoneCode: _.get(detail, 'phoneCode'),
        profileLanguage: _.get(detail, 'profileLanguage'),
        secondName: _.get(detail, 'secondName'),
        status: _.get(detail, 'status')
      }
    })(),
    updateLoading: detailLoading || updateLoading,
    openUpdateDialog,
    handleOpenUpdateDialog: props.handleOpenUpdateDialog,
    handleCloseUpdateDialog: props.handleCloseUpdateDialog,
    handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
  }
  const filterDialog = {
    initialValues: {
      manufacture: manufacture && _.map(_.split(manufacture, '-'), (item) => {
        return _.toNumber(item)
      }),
      group: group && _.map(_.split(group, '-'), (item) => {
        return _.toNumber(item)
      }),
      date: {
        startDate: moment(firstDayOfMonth),
        endDate: moment(lastDayOfMonth)
      }
  
    },
    filterLoading: false,
    openFilterDialog,
    handleOpenFilterDialog: props.handleOpenFilterDialog,
    handleCloseFilterDialog: props.handleCloseFilterDialog,
    handleClearFilterDialog: props.handleClearFilterDialog,
    handleSubmitFilterDialog: props.handleSubmitFilterDialog
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
        actionsDialog={actionsDialog}
        filterDialog={filterDialog}
        confirmMailDialog={confirmMailDialog}
      />
    </Layout>
  )
})

export default ApplicantList
