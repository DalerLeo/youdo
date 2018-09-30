import React from 'react'
import _ from 'lodash'
import {compose} from 'recompose'
import Layout from '../../../components/Layout/index'
import * as ROUTER from '../../../constants/routes'
import {listWrapper, detailWrapper} from '../../Wrappers'

import {
  SKILLS_CREATE_DIALOG_OPEN,
  SKILLS_UPDATE_DIALOG_OPEN,
  SKILLS_DELETE_DIALOG_OPEN,
  SkillsGridList
} from '../../../components/Settings/Skills'
import {
  skillsCreateAction,
  skillsUpdateAction,
  skillsListFetchAction,
  skillsDeleteAction,
  skillsItemFetchAction
} from '../../../actions/Settings/skills'

import createWrapper from '../../Wrappers/CreateWrapper'
import updateWrapper from '../../Wrappers/UpdateWrapper'
import confirmWrapper from '../../Wrappers/ConfirmWrapper'

const updateKeys = {
  name: 'name'
}

const enhance = compose(
  listWrapper({
    storeName: 'skills',
    listFetchAction: skillsListFetchAction
  }),
  detailWrapper({
    storeName: 'skills',
    paramName: 'skillsId',
    itemFetchAction: skillsItemFetchAction
  }),
  createWrapper({
    storeName: 'skills',
    formName: 'SkillsCreateForm',
    createAction: skillsCreateAction,
    queryKey: SKILLS_CREATE_DIALOG_OPEN
  }),
  updateWrapper({
    updateKeys,
    storeName: 'skills',
    formName: 'SkillsCreateForm',
    updateAction: skillsUpdateAction,
    itemPath: ROUTER.SKILLS_ITEM_URL,
    listPath: ROUTER.SKILLS_LIST_URL,
    queryKey: SKILLS_UPDATE_DIALOG_OPEN
  }),
  confirmWrapper({
    storeName: 'skills',
    confirmAction: skillsDeleteAction,
    itemPath: ROUTER.SKILLS_ITEM_URL,
    listPath: ROUTER.SKILLS_LIST_URL,
    queryKey: SKILLS_DELETE_DIALOG_OPEN,
    successMessage: 'Успешно удалено',
    failMessage: 'Удаление невозможно из-за связи с другими данными'
  })
)

const SkillsList = enhance((props) => {
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

  const detailId = _.toInteger(_.get(params, 'skillsId'))

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
      <SkillsGridList
        filter={filter}
        listData={listData}
        detailData={detailData}
        createDialog={createDialog}
        confirmDialog={confirmDialog}
        updateDialog={updateDialog}
      />
    </Layout>
  )
})

export default SkillsList
