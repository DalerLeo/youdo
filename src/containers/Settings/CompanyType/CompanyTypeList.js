import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../../constants/routes'
import filterHelper from '../../../helpers/filter'
import toBoolean from '../../../helpers/toBoolean'
import t from '../../../helpers/translate'

import {
  COMPANY_TYPE_CREATE_DIALOG_OPEN,
  COMPANY_TYPE_UPDATE_DIALOG_OPEN,
  COMPANY_TYPE_DELETE_DIALOG_OPEN,
  CompanyTypeGridList
} from '../../../components/Settings/CompanyType'
import {
  companyTypeCreateAction,
  companyTypeUpdateAction,
  companyTypeListFetchAction,
  companyTypeDeleteAction,
  companyTypeItemFetchAction
} from '../../../actions/Settings/companyType'
import {openSnackbarAction} from '../../../actions/snackbar'

const enhance = compose(
  connect((state, props) => {
    const query = _.get(props, ['location', 'query'])
    const pathname = _.get(props, ['location', 'pathname'])
    const detail = _.get(state, ['companyType', 'item', 'data'])
    const detailLoading = _.get(state, ['companyType', 'item', 'loading'])
    const createLoading = _.get(state, ['companyType', 'create', 'loading'])
    const updateLoading = _.get(state, ['companyType', 'update', 'loading'])
    const list = _.get(state, ['companyType', 'list', 'data'])
    const listLoading = _.get(state, ['companyType', 'list', 'loading'])
    const createForm = _.get(state, ['form', 'CompanyTypeCreateForm'])
    const filter = filterHelper(list, pathname, query)

    return {
      list,
      listLoading,
      detail,
      detailLoading,
      createLoading,
      updateLoading,
      filter,
      createForm
    }
  }),
  withPropsOnChange((props, nextProps) => {
    return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
  }, ({dispatch, filter}) => {
    dispatch(companyTypeListFetchAction(filter))
  }),

  withPropsOnChange((props, nextProps) => {
    const companyTypeId = _.get(nextProps, ['params', 'companyTypeId'])

    return companyTypeId && _.get(props, ['params', 'companyTypeId']) !== companyTypeId
  }, ({dispatch, params}) => {
    const companyTypeId = _.toInteger(_.get(params, 'companyTypeId'))
    companyTypeId && dispatch(companyTypeItemFetchAction(companyTypeId))
  }),

  withHandlers({
    handleActionEdit: props => () => {
      return null
    },

    handleOpenDeleteDialog: props => () => {
      return null
    },

    handleOpenConfirmDialog: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.COMPANY_TYPE_ITEM_PATH, id),
        query: filter.getParams({[COMPANY_TYPE_DELETE_DIALOG_OPEN]: true})
      })
    },

    handleCloseConfirmDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[COMPANY_TYPE_DELETE_DIALOG_OPEN]: false})})
    },
    handleSendConfirmDialog: props => () => {
      const {dispatch, detail, filter, location: {pathname}} = props
      dispatch(companyTypeDeleteAction(detail.id))
        .then(() => {
          hashHistory.push({pathname, query: filter.getParams({[COMPANY_TYPE_DELETE_DIALOG_OPEN]: false})})
          dispatch(companyTypeListFetchAction(filter))
          return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
        })
        .catch(() => {
          return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
        })
    },

    handleOpenCreateDialog: props => () => {
      const {dispatch, location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[COMPANY_TYPE_CREATE_DIALOG_OPEN]: true})})
      dispatch(reset('CompanyTypeCreateForm'))
    },

    handleCloseCreateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[COMPANY_TYPE_CREATE_DIALOG_OPEN]: false})})
    },

    handleSubmitCreateDialog: props => () => {
      const {dispatch, createForm, filter, location: {pathname}} = props

      return dispatch(companyTypeCreateAction(_.get(createForm, ['values'])))
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push({pathname, query: filter.getParams({[COMPANY_TYPE_CREATE_DIALOG_OPEN]: false})})
          dispatch(companyTypeListFetchAction(filter))
        })
    },

    handleOpenUpdateDialog: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.COMPANY_TYPE_ITEM_PATH, id),
        query: filter.getParams({[COMPANY_TYPE_UPDATE_DIALOG_OPEN]: true})
      })
    },

    handleCloseUpdateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[COMPANY_TYPE_UPDATE_DIALOG_OPEN]: false})})
    },

    handleSubmitUpdateDialog: props => () => {
      const {dispatch, createForm, filter} = props
      const companyTypeId = _.toInteger(_.get(props, ['params', 'companyTypeId']))

      return dispatch(companyTypeUpdateAction(companyTypeId, _.get(createForm, ['values'])))
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push(filter.createURL({[COMPANY_TYPE_UPDATE_DIALOG_OPEN]: false}))
          dispatch(companyTypeListFetchAction(filter))
        })
    }
  })
)

const CompanyTypeList = enhance((props) => {
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

  const openCreateDialog = toBoolean(_.get(location, ['query', COMPANY_TYPE_CREATE_DIALOG_OPEN]))
  const openUpdateDialog = toBoolean(_.get(location, ['query', COMPANY_TYPE_UPDATE_DIALOG_OPEN]))
  const openConfirmDialog = toBoolean(_.get(location, ['query', COMPANY_TYPE_DELETE_DIALOG_OPEN]))

  const detailId = _.toInteger(_.get(params, 'companyTypeId'))

  const actionsDialog = {
    handleActionEdit: props.handleActionEdit,
    handleActionDelete: props.handleOpenDeleteDialog
  }

  const createDialog = {
    createLoading,
    openCreateDialog,
    handleOpenCreateDialog: props.handleOpenCreateDialog,
    handleCloseCreateDialog: props.handleCloseCreateDialog,
    handleSubmitCreateDialog: props.handleSubmitCreateDialog
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
      const parentId = _.get(detail, 'parent')
      return {
        name: _.get(detail, 'name'),
        division: {value: _.get(detail, ['division', 'id'])},
        parent: {
          value: parentId
        }
      }
    })(),
    updateLoading: detailLoading || updateLoading,
    openUpdateDialog,
    handleOpenUpdateDialog: props.handleOpenUpdateDialog,
    handleCloseUpdateDialog: props.handleCloseUpdateDialog,
    handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
  }

  const listData = {
    data: list,
    listLoading
  }

  const detailData = {
    id: detailId,
    data: detail,
    detailLoading
  }

  return (
    <Layout {...layout}>
      <CompanyTypeGridList
        filter={filter}
        listData={listData}
        detailData={detailData}
        createDialog={createDialog}
        confirmDialog={confirmDialog}
        updateDialog={updateDialog}
        actionsDialog={actionsDialog}
      />
    </Layout>
  )
})

export default CompanyTypeList
