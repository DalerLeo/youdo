import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../../components/Layout/index'
import {
  compose,
  withPropsOnChange,
  withHandlers,
  pure
} from 'recompose'
import * as ROUTER from '../../../constants/routes'
import toBoolean from '../../../helpers/toBoolean'
import {
  ROLE_CREATE_DIALOG_OPEN,
  ROLE_UPDATE_DIALOG_OPEN,
  ROLE_CONFIRM_DIALOG_OPEN,
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
import {
  detailWrapper,
  listWrapper,
  confirmWrapper,
  createWrapper
} from '../../Wrappers'
import updateWrapper from '../../Wrappers/UpdateWrapper'

const enhance = compose(
  listWrapper({
    storeName: 'role',
    listFetchAction: roleListFetchAction
  }),
  detailWrapper({
    storeName: 'role',
    paramName: 'roleId',
    itemFetchAction: roleItemFetchAction
  }),
  createWrapper({
    storeName: 'role',
    formName: 'RoleCreateForm',
    createAction: roleCreateAction,
    queryKey: ROLE_CREATE_DIALOG_OPEN
  }),
  updateWrapper({
    updateKeys: {},
    storeName: 'role',
    formName: 'RoleCreateForm',
    updateAction: roleUpdateAction,
    itemPath: ROUTER.ROLE_ITEM_URL,
    listPath: ROUTER.ROLE_LIST_URL,
    queryKey: ROLE_UPDATE_DIALOG_OPEN
  }),
  confirmWrapper({
    storeName: 'role',
    confirmAction: roleDeleteAction,
    itemPath: ROUTER.ROLE_ITEM_URL,
    listPath: ROUTER.ROLE_LIST_URL,
    queryKey: ROLE_CONFIRM_DIALOG_OPEN,
    successMessage: 'Успешно удалено',
    failMessage: 'Удаление невозможно из-за связи с другими данными'
  }),
  connect((state, props) => {
    const permissionList = _.get(state, ['role', 'permission', 'data'])
    const permissionLoading = _.get(state, ['role', 'permission', 'loading'])
    const detailId = _.toInteger(_.get(props, ['params', 'roleId']) || '-1')
    return {
      detailId,
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

  withHandlers({
    handlePositionClick: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.ROLE_ITEM_PATH, _.toNumber(id)),
        query: filter.getParams()
      })
    }
  }),
  pure
)

const RoleList = enhance((props) => {
  const {
    list,
    listLoading,
    detail,
    filter,
    layout,
    detailId,
    permissionLoading,
    permissionList,
    confirmDialog
  } = props

  const createDialog = {
    permissionList,
    permissionLoading,
    ...props.createDialog
  }

  const updateDialog = {
    ...props.updateDialog,
    initialValues: (() => {
      const name = _.get(detail, 'name')
      const permission = []
      const perms = _.get(detail, 'permissions')
      _.each(perms, (item) => {
        permission[item] = true
      })
      if (!name || createDialog.open) {
        return {}
      }
      return {
        name: name,
        perms: permission
      }
    })()
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
