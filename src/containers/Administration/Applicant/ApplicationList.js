import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {reset} from 'redux-form'
import {compose, withHandlers, pure} from 'recompose'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../../components/Layout/index'
import * as ROUTER from '../../../constants/routes'
import {listWrapper, detailWrapper, createWrapper} from '../../Wrappers'
import changeUrl from '../../../helpers/changeUrl'
import toBoolean from '../../../helpers/toBoolean'
import {
  APPLICANT_CREATE_DIALOG_OPEN,
  APPLICANT_UPDATE_DIALOG_OPEN,
  APPLICANT_DELETE_DIALOG_OPEN,
  APPLICANT_FILTER_KEY,
  APPLICANT_FILTER_OPEN,
  ApplicantGridList
} from '../../../components/Administration/Applicant'
import {
  applicantCreateAction,
  applicantUpdateAction,
  applicantListFetchAction,
  applicantDeleteAction,
  applicantItemFetchAction
} from '../../../actions/Administration/applicant'
import {openSnackbarAction} from '../../../actions/snackbar'
import t from '../../../helpers/translate'

const mapDispatchToProps = {
  applicantCreateAction,
  applicantUpdateAction,
  applicantDeleteAction,
  openSnackbarAction
}

const mapStateToProps = (state, props) => {
  const createLoading = _.get(state, ['applicant', 'create', 'loading'])
  const updateLoading = _.get(state, ['applicant', 'update', 'loading'])
  const filterForm = _.get(state, ['form', 'ApplicantFilterForm'])
  return {
    createLoading,
    updateLoading,
    filterForm
  }
}

const enhance = compose(
  listWrapper({listFetchAction: applicantListFetchAction, storeName: 'application'}),
  detailWrapper({itemFetchAction: applicantItemFetchAction, storeName: 'application'}),
  createWrapper(applicantCreateAction, APPLICANT_CREATE_DIALOG_OPEN, 'ApplicantCreateForm'),
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
    handleSendConfirmDialog: props => () => {
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

    handleClearFilterDialog: props => () => {
      const {location: {pathname}} = props
      hashHistory.push({pathname, query: {}})
    },

    handleSubmitFilterDialog: props => () => {
      const {filter, filterForm} = props
      const manufacture = _.get(filterForm, ['values', 'manufacture']) || null
      const group = _.get(filterForm, ['values', 'group']) || null

      filter.filterBy({
        [APPLICANT_FILTER_OPEN]: false,
        [APPLICANT_FILTER_KEY.MANUFACTURE]: _.join(manufacture, '-'),
        [APPLICANT_FILTER_KEY.GROUP]: _.join(group, '-')
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

    handleOpenCreateDialog: ({filter, location, dispatch}) => () => {
      const params = {[APPLICANT_CREATE_DIALOG_OPEN]: true}
      changeUrl(filter, location.pathname, params)
      dispatch(reset('ApplicantCreateForm'))
    },

    handleCloseCreateDialog: ({filter, location}) => () => {
      const params = {[APPLICANT_CREATE_DIALOG_OPEN]: false}
      changeUrl(filter, location.pathname, params)
    },

    handleSubmitCreateDialog: props => () => {
      const {createForm, filter, location: {pathname}} = props

      // Noinspection UnterminatedStatementJS
      return props.applicantCreateAction(_.get(createForm, ['values']))
        .then(() => props.openSnackbarAction({message: t('Успешно сохранено')}))
        .then(() => {
          const params = {[APPLICANT_CREATE_DIALOG_OPEN]: false}
          changeUrl(filter, pathname, params)
          props.listFetchAction(filter)
        })
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

    handleSubmitUpdateDialog: props => () => {
      const {createForm, filter, location: {pathname}} = props
      const applicantId = _.toInteger(_.get(props, ['params', 'applicantId']))
      return props.applicantUpdateAction(applicantId, _.get(createForm, ['values']))
        .then(() => openSnackbarAction({message: t('Успешно сохранено')}))
        .then(() => {
          hashHistory.push({
            pathname,
            query: filter.getParams({[APPLICANT_UPDATE_DIALOG_OPEN]: false, 'passErr': false})
          })
          props.listFetchAction(filter)
          props.itemFetchAction(applicantId)
        })
    }
  }),
  pure
)

const ApplicantList = enhance((props) => {
  const {
    location,
    list,
    listLoading,
    detail,
    detailLoading,
    createLoading,
    updateLoading,
    filter,
    layout,
    params
  } = props
  const openFilterDialog = toBoolean(_.get(location, ['query', APPLICANT_FILTER_OPEN]))
  const openCreateDialog = toBoolean(_.get(location, ['query', APPLICANT_CREATE_DIALOG_OPEN]))
  const openUpdateDialog = toBoolean(_.get(location, ['query', APPLICANT_UPDATE_DIALOG_OPEN]))
  const openConfirmDialog = toBoolean(_.get(location, ['query', APPLICANT_DELETE_DIALOG_OPEN]))

  const manufacture = _.toInteger(filter.getParam(APPLICANT_FILTER_KEY.MANUFACTURE))
  const group = _.toInteger(filter.getParam(APPLICANT_FILTER_KEY.GROUP))
  const detailId = _.toInteger(_.get(params, 'id'))

  const actionsDialog = {
    handleActionEdit: props.handleActionEdit,
    handleActionDelete: props.handleOpenDeleteDialog
  }

  console.warn(props)
  const createDialog = {
    createLoading,
    openCreateDialog,
    ...props.createDialog
  }
  const confirmDialog = {
    confirmLoading: detailLoading,
    openConfirmDialog: openConfirmDialog,
    handleOpenConfirmDialog: props.handleOpenConfirmDialog,
    handleCloseConfirmDialog: props.handleCloseConfirmDialog,
    handleSendConfirmDialog: props.handleSendConfirmDialog
  }
  const updateDialog = {
    initialValues: (() => {
      if (!detail || openCreateDialog) {
        return {}
      }
      return {
        firstName: _.get(detail, 'firstName'),
        lastName: _.get(detail, 'lastName'),
        email: _.get(detail, 'email'),
        address: _.get(detail, 'address'),
        countryCode: _.get(detail, 'countryCode'),
        photo: _.get(detail, 'photo'),
        phoneNumber: _.get(detail, 'phoneNumber'),
        role: {value: _.get(detail, ['groups', '0', 'id'])},
        position: {value: _.get(detail, ['position', 'id'])},
        sphere: {value: _.get(detail, ['sphere', 'id'])},
        gender: {value: _.get(detail, ['gender', 'id'])},
        martialStatus: {value: _.get(detail, ['martialStatus', 'id'])},
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
      })
    },
    filterLoading: false,
    openFilterDialog,
    handleOpenFilterDialog: props.handleOpenFilterDialog,
    handleCloseFilterDialog: props.handleCloseFilterDialog,
    handleClearFilterDialog: props.handleClearFilterDialog,
    handleSubmitFilterDialog: props.handleSubmitFilterDialog
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
      />
    </Layout>
  )
})

export default ApplicantList
