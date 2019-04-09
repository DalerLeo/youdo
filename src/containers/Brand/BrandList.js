import React from 'react'
import _ from 'lodash'
import Layout from '../../components/Layout'
import {compose} from 'recompose'
import * as ROUTER from '../../constants/routes'
import {
  listWrapper,
  detailWrapper,
  createWrapper,
  confirmWrapper,
  updateWrapper
} from '../Wrappers'

import {
  BRAND_CREATE_DIALOG_OPEN,
  BRAND_UPDATE_DIALOG_OPEN,
  BRAND_DELETE_DIALOG_OPEN,
  BrandGridList
} from './component'
import {
  brandCreateAction,
  brandUpdateAction,
  brandListFetchAction,
  brandDeleteAction,
  brandItemFetchAction
} from './actions/brand'

const UPDATE_KEYS = {
  name: 'title',
}

const enhance = compose(
  listWrapper({
    storeName: 'brand',
    listFetchAction: brandListFetchAction
  }),
  detailWrapper({
    storeName: 'brand',
    itemFetchAction: brandItemFetchAction
  }),
  createWrapper({
    createAction: brandCreateAction,
    queryKey: BRAND_CREATE_DIALOG_OPEN,
    storeName: 'brand',
    formName: 'BrandCreateForm'
  }),
  updateWrapper({
    updateKeys: UPDATE_KEYS,
    storeName: 'brand',
    formName: 'BrandCreateForm',
    updateAction: brandUpdateAction,
    queryKey: BRAND_UPDATE_DIALOG_OPEN,
    itemPath: ROUTER.BRAND_ITEM_PATH,
    listPath: ROUTER.BRAND_LIST_URL
  }),
  confirmWrapper({
    storeName: 'brand',
    confirmAction: brandDeleteAction,
    queryKey: BRAND_DELETE_DIALOG_OPEN,
    itemPath: ROUTER.BRAND_ITEM_PATH,
    listPath: ROUTER.BRAND_LIST_URL,
    successMessage: 'Успешно удалено',
    failMessage: 'Удаление невозможно из-за связи с другими данными'
  })
)

const BrandList = enhance((props) => {
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

  const detailId = _.toInteger(_.get(params, 'id'))

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
      <BrandGridList
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

export default BrandList
