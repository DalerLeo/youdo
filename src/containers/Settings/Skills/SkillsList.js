import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {reset} from 'redux-form'
import {compose, withHandlers} from 'recompose'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../../components/Layout/index'
import * as ROUTER from '../../../constants/routes'
import toBoolean from '../../../helpers/toBoolean'
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
import {openSnackbarAction} from '../../../actions/snackbar'
import t from '../../../helpers/translate'

const enhance = compose(
  listWrapper({listFetchAction: skillsListFetchAction, storeName: 'skills'}),
  detailWrapper({itemFetchAction: skillsItemFetchAction, storeName: 'skills', paramName: 'skillsId'}),
  connect((state, props) => {
    const createLoading = _.get(state, ['skills', 'create', 'loading'])
    const updateLoading = _.get(state, ['skills', 'update', 'loading'])
    const filterForm = _.get(state, ['form', 'SkillsFilterForm'])
    const createForm = _.get(state, ['form', 'SkillsCreateForm'])

    return {
      createLoading,
      updateLoading,
      filterForm,
      createForm
    }
  }),

  withHandlers({
    handleOpenConfirmDialog: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.SKILLS_ITEM_PATH, id),
        query: filter.getParams({[SKILLS_DELETE_DIALOG_OPEN]: true})
      })
    },

    handleCloseConfirmDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[SKILLS_DELETE_DIALOG_OPEN]: false})})
    },
    handleSendConfirmDialog: props => () => {
      const {dispatch, detail, filter, location: {pathname}} = props
      dispatch(skillsDeleteAction(detail.id))
        .then(() => {
          hashHistory.push({pathname, query: filter.getParams({[SKILLS_DELETE_DIALOG_OPEN]: false})})
          dispatch(skillsListFetchAction(filter))
          return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
        })
        .catch(() => {
          return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
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

    handleOpenCreateDialog: props => () => {
      const {dispatch, location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[SKILLS_CREATE_DIALOG_OPEN]: true})})
      dispatch(reset('SkillsCreateForm'))
    },

    handleCloseCreateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[SKILLS_CREATE_DIALOG_OPEN]: false})})
    },

    handleSubmitCreateDialog: props => () => {
      const {dispatch, createForm, filter, location: {pathname}} = props

      return dispatch(skillsCreateAction(_.get(createForm, ['values'])))
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push({pathname, query: filter.getParams({[SKILLS_CREATE_DIALOG_OPEN]: false})})
          dispatch(skillsListFetchAction(filter))
        })
    },

    handleOpenUpdateDialog: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.SKILLS_ITEM_PATH, id),
        query: filter.getParams({[SKILLS_UPDATE_DIALOG_OPEN]: true})
      })
    },

    handleCloseUpdateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[SKILLS_UPDATE_DIALOG_OPEN]: false})})
    },

    handleSubmitUpdateDialog: props => () => {
      const {dispatch, createForm, filter, location: {pathname}} = props
      const skillsId = _.toInteger(_.get(props, ['params', 'skillsId']))
      return dispatch(skillsUpdateAction(skillsId, _.get(createForm, ['values'])))
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push({
            pathname,
            query: filter.getParams({[SKILLS_UPDATE_DIALOG_OPEN]: false, 'passErr': false})
          })
          dispatch(skillsListFetchAction(filter))
          dispatch(skillsItemFetchAction(skillsId))
        })
    }
  })
)

const SkillsList = enhance((props) => {
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

  const openCreateDialog = toBoolean(_.get(location, ['query', SKILLS_CREATE_DIALOG_OPEN]))
  const openUpdateDialog = toBoolean(_.get(location, ['query', SKILLS_UPDATE_DIALOG_OPEN]))
  const openConfirmDialog = toBoolean(_.get(location, ['query', SKILLS_DELETE_DIALOG_OPEN]))
  const detailId = _.toInteger(_.get(params, 'skillsId'))

  const createDialog = {
    initialValues: (() => {
      return {}
    })(),
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
      return {
        name: _.get(detail, 'name')
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
