import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../../components/Layout/index'
import {compose, withPropsOnChange, withState, withHandlers, pure} from 'recompose'
import * as ROUTER from '../../../constants/routes'
import filterHelper from '../../../helpers/filter'
import toBoolean from '../../../helpers/toBoolean'
import {
  ROLE_CREATE_DIALOG_OPEN,
  ROLE_UPDATE_DIALOG_OPEN,
  RoleGridList
} from '../../../components/Settings/Role/index'
import {
  roleCreateAction,
  roleUpdateAction,
  roleListFetchAction,
  roleDeleteAction,
  roleItemFetchAction,
  rolePermissionListFetchAction
} from '../../../actions/Settings/role'
import {openSnackbarAction} from '../../../actions/snackbar'
import t from '../../../helpers/translate'
import {ZERO} from '../../../constants/backendConstants'
import {detailWrapper, listWrapper} from '../../Wrappers'

const enhance = compose(
  listWrapper({listFetchAction: roleListFetchAction, storeName: 'role'}),
  detailWrapper({itemFetchAction: roleItemFetchAction, storeName: 'role', paramName: 'roleId'}),
  connect((state, props) => {
    const query = _.get(props, ['location', 'query'])
    const pathname = _.get(props, ['location', 'pathname'])
    const detail = _.get(state, ['role', 'item', 'data'])
    const detailLoading = _.get(state, ['role', 'item', 'loading'])
    const createLoading = _.get(state, ['role', 'create', 'loading'])
    const updateLoading = _.get(state, ['role', 'update', 'loading'])
    const list = _.get(state, ['role', 'list', 'data'])
    const permissionList = _.get(state, ['role', 'permission', 'data'])
    const permissionLoading = _.get(state, ['role', 'permission', 'loading'])
    const listLoading = _.get(state, ['role', 'list', 'loading'])
    const createForm = _.get(state, ['form', 'RoleCreateForm'])
    const courseForm = _.get(state, ['form', 'AddCourseForm'])
    const baseCreateForm = _.get(state, ['form', 'BasePositionCreateForm'])
    const detailId = _.toInteger(_.get(props, ['params', 'roleId']) || '-1')
    const detailFilter = filterHelper(detail, pathname, query)
    const filter = filterHelper(list, pathname, query)
    return {
      list,
      listLoading,
      detail,
      detailLoading,
      createLoading,
      updateLoading,
      filter,
      baseCreateForm,
      createForm,
      courseForm,
      detailId,
      detailFilter,
      permissionList,
      permissionLoading
    }
  }),

  withPropsOnChange((props, nextProps) => {
    const prevCreateDialog = toBoolean(_.get(props, ['location', 'query', ROLE_CREATE_DIALOG_OPEN]))
    const nextCreateDialog = toBoolean(_.get(nextProps, ['location', 'query', ROLE_CREATE_DIALOG_OPEN]))
    const prevUpdateDialog = toBoolean(_.get(props, ['location', 'query', ROLE_UPDATE_DIALOG_OPEN]))
    const nextUpdateDialog = toBoolean(_.get(nextProps, ['location', 'query', ROLE_UPDATE_DIALOG_OPEN]))
    return (prevCreateDialog !== nextCreateDialog || prevUpdateDialog !== nextUpdateDialog) &&
               (nextUpdateDialog === true || nextCreateDialog === true)
  }, ({dispatch, filter, location}) => {
    const createDialogDialog = toBoolean(_.get(location, ['query', ROLE_CREATE_DIALOG_OPEN]))
    const updateDialogDialog = toBoolean(_.get(location, ['query', ROLE_UPDATE_DIALOG_OPEN]))

    if (createDialogDialog || updateDialogDialog) {
      dispatch(rolePermissionListFetchAction(filter))
    }
  }),

  withState('openConfirmDialog', 'setOpenConfirmDialog', false),

  withHandlers({
    handleOpenConfirmDialog: props => (id) => {
      const {filter, setOpenConfirmDialog} = props
      setOpenConfirmDialog(id)
      hashHistory.push({pathname: sprintf(ROUTER.ROLE_ITEM_PATH, id), query: filter.getParams()})
    },

    handleCloseConfirmDialog: props => () => {
      const {filter, setOpenConfirmDialog, location: {pathname}} = props
      setOpenConfirmDialog(false)
      hashHistory.push({pathname, query: filter.getParams()})
    },

    handleSendConfirmDialog: props => () => {
      const {dispatch, filter, setOpenConfirmDialog, openConfirmDialog} = props
      dispatch(roleDeleteAction(_.toNumber(openConfirmDialog)))
        .then(() => {
          setOpenConfirmDialog(false)
          dispatch(roleListFetchAction(filter))
          return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
        })
        .catch(() => {
          return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
        })
    },

    handleOpenCreateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[ROLE_CREATE_DIALOG_OPEN]: true})})
    },

    handleCloseCreateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[ROLE_CREATE_DIALOG_OPEN]: false})})
    },

    handleSubmitCreateDialog: props => () => {
      const {location: {pathname}, dispatch, createForm, filter} = props

      return dispatch(roleCreateAction(_.get(createForm, ['values'])))
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push({pathname, query: filter.getParams({[ROLE_CREATE_DIALOG_OPEN]: false})})
          dispatch(roleListFetchAction(filter))
        })
    },

    handleOpenUpdateDialog: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.ROLE_ITEM_PATH, _.toNumber(id)),
        query: filter.getParams({[ROLE_UPDATE_DIALOG_OPEN]: true})
      })
    },

    handleCloseUpdateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({
        pathname,
        query: filter.getParams({[ROLE_UPDATE_DIALOG_OPEN]: false})
      })
    },

    handleSubmitUpdateDialog: props => () => {
      const {dispatch, createForm, filter, detailId} = props
      return dispatch(roleUpdateAction(detailId, _.get(createForm, ['values'])))
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push(filter.createURL({[ROLE_UPDATE_DIALOG_OPEN]: false}))
          dispatch(roleListFetchAction(filter))
        })
    },

    handlePositionClick: props => (id) => {
      const {filter} = props
      hashHistory.push({pathname: sprintf(ROUTER.ROLE_ITEM_PATH, _.toNumber(id)), query: filter.getParams()})
    }
  }),
  pure
)

const RoleList = enhance((props) => {
  const {
    location,
    list,
    listLoading,
    detail,
    detailLoading,
    createLoading,
    updateLoading,
    openConfirmDialog,
    filter,
    layout,
    detailId,
    permissionLoading,
    permissionList
  } = props

  const openCreateDialog = toBoolean(_.get(location, ['query', ROLE_CREATE_DIALOG_OPEN]))
  const openUpdateDialog = toBoolean(_.get(location, ['query', ROLE_UPDATE_DIALOG_OPEN]))

  const createDialog = {
    initialValues: (() => {
      return {}
    })(),
    permissionList,
    permissionLoading,
    createLoading,
    openCreateDialog,
    handleOpenCreateDialog: props.handleOpenCreateDialog,
    handleCloseCreateDialog: props.handleCloseCreateDialog,
    handleSubmitCreateDialog: props.handleSubmitCreateDialog
  }

  const confirmDialog = {
    openConfirmDialog: openConfirmDialog > ZERO,
    handleOpenConfirmDialog: props.handleOpenConfirmDialog,
    handleCloseConfirmDialog: props.handleCloseConfirmDialog,
    handleSendConfirmDialog: props.handleSendConfirmDialog
  }

  const updateDialog = {
    initialValues: (() => {
      const name = _.get(detail, 'name')
      const permission = []
      const perms = _.get(detail, 'permissions')
      _.each(perms, (item) => {
        permission[item] = true
      })
      if (!name || openCreateDialog) {
        return {}
      }
      return {
        name: name,
        perms: permission
      }
    })(),
    updateLoading: detailLoading || updateLoading,
    openUpdateDialog,
    handleOpenUpdateDialog: props.handleOpenUpdateDialog,
    handleCloseUpdateDialog: props.handleCloseUpdateDialog,
    handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
  }

  const listData = {
    data: _.get(list, 'results'),
    listLoading,
    handlePositionClick: props.handlePositionClick
  }

  return (
    <Layout {...layout}>
      <RoleGridList
        filter={filter}
        listData={listData}
        createDialog={createDialog}
        confirmDialog={confirmDialog}
        updateDialog={updateDialog}
        detailId={detailId}
      />
    </Layout>
  )
})

export default RoleList
