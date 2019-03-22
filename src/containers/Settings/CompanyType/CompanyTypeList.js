import React from 'react'
import _ from 'lodash'
import Layout from '../../../components/Layout'
import {compose} from 'recompose'
import * as ROUTER from '../../../constants/routes'
import {
  listWrapper,
  detailWrapper,
  createWrapper,
  confirmWrapper,
  updateWrapper
} from '../../Wrappers'

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
} from '../../../actions/Settings/service'

const UPDATE_KEYS = {
  name: 'name',
  price: 'price',
}

const enhance = compose(
  listWrapper({
    storeName: 'service',
    listFetchAction: companyTypeListFetchAction
  }),
  detailWrapper({
    storeName: 'service',
    paramName: 'companyTypeId',
    itemFetchAction: companyTypeItemFetchAction
  }),
  createWrapper({
    createAction: companyTypeCreateAction,
    queryKey: COMPANY_TYPE_CREATE_DIALOG_OPEN,
    storeName: 'plan',
    formName: 'CompanyTypeCreateForm'
  }),
  updateWrapper({
    updateKeys: UPDATE_KEYS,
    storeName: 'companyType',
    formName: 'CompanyTypeCreateForm',
    updateAction: companyTypeUpdateAction,
    queryKey: COMPANY_TYPE_UPDATE_DIALOG_OPEN,
    itemPath: ROUTER.COMPANY_TYPE_ITEM_PATH,
    listPath: ROUTER.COMPANY_TYPE_LIST_URL
  }),
  confirmWrapper({
    storeName: 'companyType',
    confirmAction: companyTypeDeleteAction,
    queryKey: COMPANY_TYPE_DELETE_DIALOG_OPEN,
    itemPath: ROUTER.COMPANY_TYPE_ITEM_PATH,
    listPath: ROUTER.COMPANY_TYPE_LIST_URL,
    successMessage: 'Успешно удалено',
    failMessage: 'Удаление невозможно из-за связи с другими данными'
  })
)

const CompanyTypeList = enhance((props) => {
  const {
    list,
    listLoading,
    detail,
    detailLoading,
    filter,
    layout,
    params,
    createDialog,
    updateDialog,
    confirmDialog
  } = props

  const detailId = _.toInteger(_.get(params, 'companyTypeId'))

  const actionsDialog = {
    handleActionEdit: props.handleActionEdit,
    handleActionDelete: props.handleOpenDeleteDialog
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
