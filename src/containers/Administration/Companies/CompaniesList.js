import React from 'react'
import _ from 'lodash'
import fp from 'lodash/fp'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../../components/Layout'
import {compose, withHandlers, mapPropsStream, pure} from 'recompose'
import * as ROUTER from '../../../constants/routes'
import filterHelper from '../../../helpers/filter'
import {compareFilterByProps} from '../../../helpers/get'
import toBoolean from '../../../helpers/toBoolean'
import {
  COMPANIES_CREATE_DIALOG_OPEN,
  COMPANIES_UPDATE_DIALOG_OPEN,
  COMPANIES_DELETE_DIALOG_OPEN,
  CompaniesGridList
} from '../../../components/Administration/Companies'
import {
  companiesCreateAction,
  companiesUpdateAction,
  companiesListFetchAction,
  companiesDeleteAction,
  companiesItemFetchAction
} from '../../../actions/Administration/companies'
import {openSnackbarAction} from '../../../actions/snackbar'
import t from '../../../helpers/translate'

const mapStateToProps = (state, props) => {
  const query = _.get(props, ['location', 'query'])
  const pathname = _.get(props, ['location', 'pathname'])
  const detail = _.get(state, ['companies', 'item', 'data'])
  const detailLoading = _.get(state, ['companies', 'item', 'loading'])
  const createLoading = _.get(state, ['companies', 'create', 'loading'])
  const updateLoading = _.get(state, ['companies', 'update', 'loading'])
  const list = _.get(state, ['companies', 'list', 'data'])
  const listLoading = _.get(state, ['companies', 'list', 'loading'])
  const createForm = _.get(state, ['form', 'CompaniesCreateForm'])
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
}

const mapDispatchToProps = {
  companiesCreateAction,
  companiesUpdateAction,
  companiesListFetchAction,
  companiesDeleteAction,
  companiesItemFetchAction
}
const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),

  mapPropsStream((props$) => {
    props$
      .distinctUntilChanged(compareFilterByProps)
      .subscribe(({filter, ...props}) => props.companiesListFetchAction(filter))

    props$
      .filter(fp.get('params.companyId'))
      .distinctUntilChanged(null, ('params.companyId'))
      .subscribe(props => {
        const companyId = fp.flow(fp.get('params.companyId'), fp.toInteger)
        props.companiesItemFetchAction(companyId(props))
      })

    return props$
  }),
  withHandlers({
    handleActionEdit: props => () => {
      return null
    },

    handleOpenConfirmDialog: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.COMPANIES_ITEM_PATH, id),
        query: filter.getParams({[COMPANIES_DELETE_DIALOG_OPEN]: true})
      })
    },

    handleCloseConfirmDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[COMPANIES_DELETE_DIALOG_OPEN]: false})})
    },
    handleSendConfirmDialog: props => () => {
      const {dispatch, detail, filter, location: {pathname}} = props
      props.companiesDeleteAction(detail.id)
        .then(() => {
          hashHistory.push({pathname, query: filter.getParams({[COMPANIES_DELETE_DIALOG_OPEN]: false})})
          dispatch(companiesListFetchAction(filter))
          return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
        })
        .catch(() => {
          return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
        })
    },

    handleOpenCreateDialog: props => () => {
      const {dispatch, location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[COMPANIES_CREATE_DIALOG_OPEN]: true})})
      dispatch(reset('CompaniesCreateForm'))
    },

    handleCloseCreateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[COMPANIES_CREATE_DIALOG_OPEN]: false})})
    },

    handleSubmitCreateDialog: props => () => {
      const {dispatch, createForm, filter, location: {pathname}} = props

      return dispatch(companiesCreateAction(_.get(createForm, ['values'])))
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push({pathname, query: filter.getParams({[COMPANIES_CREATE_DIALOG_OPEN]: false})})
          dispatch(companiesListFetchAction(filter))
        })
    },

    handleOpenUpdateDialog: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.COMPANIES_ITEM_PATH, id),
        query: filter.getParams({[COMPANIES_UPDATE_DIALOG_OPEN]: true})
      })
    },

    handleCloseUpdateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[COMPANIES_UPDATE_DIALOG_OPEN]: false})})
    },

    handleSubmitUpdateDialog: props => () => {
      const {dispatch, createForm, filter} = props
      const companyId = _.toInteger(_.get(props, ['params', 'companyId']))

      return dispatch(companiesUpdateAction(companyId, _.get(createForm, ['values'])))
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push(filter.createURL({[COMPANIES_UPDATE_DIALOG_OPEN]: false}))
          dispatch(companiesListFetchAction(filter))
        })
    }
  }),
  pure
)

const CompaniesList = enhance((props) => {
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

  const openCreateDialog = toBoolean(_.get(location, ['query', COMPANIES_CREATE_DIALOG_OPEN]))
  const openUpdateDialog = toBoolean(_.get(location, ['query', COMPANIES_UPDATE_DIALOG_OPEN]))
  const openConfirmDialog = toBoolean(_.get(location, ['query', COMPANIES_DELETE_DIALOG_OPEN]))

  const detailId = _.toInteger(_.get(params, 'companyId'))

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
        return {
          users: [{}]
        }
      }
      return {
        title: _.get(detail, 'title'),
        text: _.get(detail, 'text')
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
      <CompaniesGridList
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

export default CompaniesList
