import React from 'react'
import _ from 'lodash'
import {compose, pure} from 'recompose'
import {connect} from 'react-redux'
import Layout from '../../../components/Layout/index'
import {
  listWrapper,
  detailWrapper,
  createWrapper,
  updateWrapper,
  confirmWrapper
} from '../../Wrappers/index'

import {
  JOB_SEARCH_CREATE_DIALOG_OPEN,
  JOB_SEARCH_UPDATE_DIALOG_OPEN,
  JOB_SEARCH_DELETE_DIALOG_OPEN,
  JobSearchGridList
} from '../../../components/Settings/JobSearch'

import {
  jobSearchCreateAction,
  jobSearchDeleteAction,
  jobSearchItemFetchAction,
  jobSearchListFetchAction,
  jobSearchUpdateAction
} from '../../../actions/Settings/jobSearch'

import * as ROUTER from '../../../constants/routes'

const updateKeys = {
  'name': 'name'
}

const mapStateToProps = () => ({})

const enhance = compose(
  listWrapper({
    storeName: 'jobSearch',
    listFetchAction: jobSearchListFetchAction
  }),
  detailWrapper({
    storeName: 'jobSearch',
    itemFetchAction: jobSearchItemFetchAction
  }),
  createWrapper({
    storeName: 'jobSearch',
    formName: 'JobSearchCreateForm',
    createAction: jobSearchCreateAction,
    queryKey: JOB_SEARCH_CREATE_DIALOG_OPEN
  }),
  updateWrapper({
    updateKeys,
    storeName: 'jobSearch',
    formName: 'JobSearchCreateForm',
    updateAction: jobSearchUpdateAction,
    itemPath: ROUTER.JOB_SEARCH_ITEM_PATH,
    listPath: ROUTER.JOB_SEARCH_LIST_URL,
    queryKey: JOB_SEARCH_UPDATE_DIALOG_OPEN
  }),
  confirmWrapper({
    storeName: 'jobSearch',
    confirmAction: jobSearchDeleteAction,
    itemPath: ROUTER.JOB_SEARCH_ITEM_PATH,
    listPath: ROUTER.JOB_SEARCH_LIST_URL,
    queryKey: JOB_SEARCH_DELETE_DIALOG_OPEN,
    successMessage: 'Успешно удалено',
    failMessage: 'Удаление невозможно из-за связи с другими данными'
  }),
  connect(mapStateToProps),
  pure
)

const JobSearchList = enhance((props) => {
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
      <JobSearchGridList
        filter={filter}
        listData={listData}
        detailData={detailData}
        createDialog={createDialog}
        updateDialog={updateDialog}
        confirmDialog={confirmDialog}
      />
    </Layout>
  )
})

export default JobSearchList
