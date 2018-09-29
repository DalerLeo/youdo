import React from 'react'
import _ from 'lodash'
import {compose, pure} from 'recompose'
import {connect} from 'react-redux'
import {
  filterWrapper,
  confirmWrapper,
  updateWrapper,
  createWrapper,
  detailWrapper,
  listWrapper
} from '../../Wrappers'
import Layout from '../../../components/Layout/index'
import * as ROUTER from '../../../constants/routes'
import {
  USERS_CREATE_DIALOG_OPEN,
  USERS_UPDATE_DIALOG_OPEN,
  USERS_DELETE_DIALOG_OPEN,
  USERS_FILTER_KEY,
  USERS_FILTER_OPEN,
  UsersGridList
} from '../../../components/Settings/Users/index'
import {
  usersCreateAction,
  usersUpdateAction,
  usersListFetchAction,
  usersDeleteAction,
  usersItemFetchAction
} from '../../../actions/Settings/users'
import {openSnackbarAction} from '../../../actions/snackbar'

const mapDispatchToProps = {
  usersCreateAction,
  usersUpdateAction,
  usersListFetchAction,
  usersDeleteAction,
  usersItemFetchAction,
  openSnackbarAction
}
const updateKeys = {
  firstNameEn: 'fullName',
  firstNameRu: 'fullName'
}

const createKeys = {
  phoneNumber: '+998'
}
const mapStateToProps = () => ({})

const enhance = compose(
  listWrapper({
    storeName: 'users',
    listFetchAction: usersListFetchAction
  }),
  detailWrapper({
    storeName: 'users',
    paramName: 'usersId',
    itemFetchAction: usersItemFetchAction
  }),
  createWrapper({
    storeName: 'users',
    formName: 'UsersCreateForm',
    createAction: usersCreateAction,
    queryKey: USERS_CREATE_DIALOG_OPEN
  }),
  updateWrapper({
    updateKeys,
    createKeys,
    storeName: 'users',
    formName: 'UsersCreateForm',
    updateAction: usersUpdateAction,
    itemPath: ROUTER.USERS_ITEM_PATH,
    listPath: ROUTER.USERS_LIST_URL,
    queryKey: USERS_UPDATE_DIALOG_OPEN
  }),
  confirmWrapper({
    storeName: 'users',
    confirmAction: usersDeleteAction,
    itemPath: ROUTER.USERS_ITEM_PATH,
    listPath: ROUTER.USERS_LIST_URL,
    queryKey: USERS_DELETE_DIALOG_OPEN,
    successMessage: 'Успешно удалено',
    failMessage: 'Удаление невозможно из-за связи с другими данными'
  }),
  filterWrapper({
    formName: 'UsersFilterForm',
    queryKey: USERS_FILTER_OPEN,
    filterKeys: USERS_FILTER_KEY
  }),
  connect(mapStateToProps, mapDispatchToProps),
  pure
)

const UsersList = enhance((props) => {
  const {
    list,
    listLoading,
    detail,
    detailLoading,
    filter,
    layout,
    params,
    createDialog,
    filterDialog,
    updateDialog,
    confirmDialog
  } = props

  const detailId = _.toInteger(_.get(params, 'usersId'))

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
      <UsersGridList
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

export default UsersList
