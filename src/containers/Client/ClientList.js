import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import moment from 'moment'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import updateStore from '../../helpers/updateStore'
import {joinArray, splitToArray} from '../../helpers/joinSplitValues'
import * as actionTypes from '../../constants/actionTypes'
import {
  CLIENT_CREATE_DIALOG_OPEN,
  CLIENT_UPDATE_DIALOG_OPEN,
  ClientGridList
} from '../../components/Client'
import {CLIENT_FILTER_KEY, CLIENT_FILTER_OPEN} from '../../components/Client/ClientFilterDialog'
import {
  clientCreateAction,
  clientUpdateAction,
  clientListFetchAction,
  clientDeleteAction,
  clientItemFetchAction
} from '../../actions/client'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

const enhance = compose(
  connect((state, props) => {
    const query = _.get(props, ['location', 'query'])
    const pathname = _.get(props, ['location', 'pathname'])
    const detail = _.get(state, ['client', 'item', 'data'])
    const detailLoading = _.get(state, ['client', 'item', 'loading'])
    const createLoading = _.get(state, ['client', 'create', 'loading'])
    const updateLoading = _.get(state, ['client', 'update', 'loading'])
    const list = _.get(state, ['client', 'list', 'data'])
    const listLoading = _.get(state, ['client', 'list', 'loading'])
    const createForm = _.get(state, ['form', 'ClientCreateForm'])
    const filterForm = _.get(state, ['form', 'ClientFilterForm'])
    const filter = filterHelper(list, pathname, query)

    return {
      list,
      listLoading,
      detail,
      detailLoading,
      createLoading,
      updateLoading,
      filter,
      createForm,
      filterForm
    }
  }),
  withPropsOnChange((props, nextProps) => {
    return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
  }, ({dispatch, filter}) => {
    dispatch(clientListFetchAction(filter))
  }),

  withPropsOnChange((props, nextProps) => {
    const clientId = _.get(nextProps, ['params', 'clientId'])
    return clientId && _.get(props, ['params', 'clientId']) !== clientId
  }, ({dispatch, params}) => {
    const clientId = _.toInteger(_.get(params, 'clientId'))
    clientId && dispatch(clientItemFetchAction(clientId))
  }),

  withState('openConfirmDialog', 'setOpenConfirmDialog', false),

  withHandlers({
    handleOpenFilterDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[CLIENT_FILTER_OPEN]: true})})
    },

    handleCloseFilterDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[CLIENT_FILTER_OPEN]: false})})
    },

    handleClearFilterDialog: props => () => {
      const {location: {pathname}} = props
      hashHistory.push({pathname, query: {}})
    },
    handleSubmitFilterDialog: props => () => {
      const {filter, filterForm} = props
      const fromWho = _.get(filterForm, ['values', 'fromWho']) || null
      const inBlacklist = _.get(filterForm, ['values', 'inBlacklist']) || null
      const createdFromDate = _.get(filterForm, ['values', 'createdDate', 'fromDate']) || null
      const createdToDate = _.get(filterForm, ['values', 'createdDate', 'toDate']) || null
      filter.filterBy({
        [CLIENT_FILTER_OPEN]: false,
        [CLIENT_FILTER_KEY.FROM_WHO]: joinArray(fromWho),
        [CLIENT_FILTER_KEY.IN_BLACKLIST]: inBlacklist,
        [CLIENT_FILTER_KEY.FROM_DATE]: createdFromDate && createdFromDate.format('YYYY-MM-DD'),
        [CLIENT_FILTER_KEY.TO_DATE]: createdToDate && createdToDate.format('YYYY-MM-DD')
      })
    },

    handleActionEdit: props => () => {
      return null
    },

    handleOpenConfirmDialog: props => () => {
      const {setOpenConfirmDialog} = props
      setOpenConfirmDialog(true)
    },

    handleCloseConfirmDialog: props => () => {
      const {setOpenConfirmDialog} = props
      setOpenConfirmDialog(false)
    },
    handleSendConfirmDialog: props => () => {
      const {dispatch, detail, setOpenConfirmDialog, filter} = props
      dispatch(clientDeleteAction(detail.id))
        .then(() => {
          setOpenConfirmDialog(false)
          dispatch(clientListFetchAction(filter))
          return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
        })
        .catch(() => {
          return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
        })
    },

    handleOpenCreateDialog: props => () => {
      const {dispatch, location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[CLIENT_CREATE_DIALOG_OPEN]: true})})
      dispatch(reset('ClientCreateForm'))
    },

    handleCloseCreateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[CLIENT_CREATE_DIALOG_OPEN]: false})})
    },

    handleSubmitCreateDialog: props => () => {
      const {dispatch, createForm, filter} = props

      return dispatch(clientCreateAction(_.get(createForm, ['values'])))
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          dispatch(clientListFetchAction(filter))
          hashHistory.push(filter.createURL({[CLIENT_CREATE_DIALOG_OPEN]: false}))
        })
    },

    handleOpenUpdateDialog: props => (id) => {
      const {filter} = props
      hashHistory.push({
        pathname: sprintf(ROUTER.CLIENT_ITEM_PATH, id),
        query: filter.getParams({[CLIENT_UPDATE_DIALOG_OPEN]: true})
      })
    },

    handleCloseUpdateDialog: props => () => {
      const {location: {pathname}, filter} = props
      hashHistory.push({pathname, query: filter.getParams({[CLIENT_UPDATE_DIALOG_OPEN]: false})})
    },

    handleSubmitUpdateDialog: props => () => {
      const {dispatch, createForm, filter, list} = props
      const clientId = _.toInteger(_.get(props, ['params', 'clientId']))

      return dispatch(clientUpdateAction(clientId, _.get(createForm, ['values'])))
        .then(() => {
          return dispatch(clientItemFetchAction(clientId))
            .then((data) => {
              const detail = _.get(data, 'value')
              return dispatch(updateStore(clientId, list, actionTypes.CLIENT_LIST, {
                address: _.get(detail, 'address'),
                name: _.get(detail, 'name')
              }))
            })
        })
        .then(() => {
          return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
        })
        .then(() => {
          hashHistory.push(filter.createURL({[CLIENT_UPDATE_DIALOG_OPEN]: false}))
        })
    },

    handleCloseDetail: props => () => {
      const {filter} = props
      hashHistory.push({pathname: ROUTER.CLIENT_LIST_URL, query: filter.getParams()})
    }
  })
)

const ClientList = enhance((props) => {
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

  const openFilterDialog = toBoolean(_.get(location, ['query', CLIENT_FILTER_OPEN]))
  const openCreateDialog = toBoolean(_.get(location, ['query', CLIENT_CREATE_DIALOG_OPEN]))
  const openUpdateDialog = toBoolean(_.get(location, ['query', CLIENT_UPDATE_DIALOG_OPEN]))
  const detailId = _.toInteger(_.get(params, 'clientId'))
  const tab = _.get(params, 'tab')

  const createdFromDate = filter.getParam(CLIENT_FILTER_KEY.FROM_DATE)
  const createdToDate = filter.getParam(CLIENT_FILTER_KEY.TO_DATE)
  const inBlacklist = filter.getParam(CLIENT_FILTER_KEY.IN_BLACKLIST)
  const fromWho = filter.getParam(CLIENT_FILTER_KEY.FROM_WHO)

  const filterDialog = {
    initialValues: {
      inBlacklist,
      fromWho: fromWho && splitToArray(fromWho),
      createdDate: {
        fromDate: createdFromDate && moment(createdFromDate, 'YYYY-MM-DD'),
        toDate: createdToDate && moment(createdToDate, 'YYYY-MM-DD')
      }
    },
    filterLoading: false,
    openFilterDialog,
    handleOpenFilterDialog: props.handleOpenFilterDialog,
    handleCloseFilterDialog: props.handleCloseFilterDialog,
    handleClearFilterDialog: props.handleClearFilterDialog,
    handleSubmitFilterDialog: props.handleSubmitFilterDialog
  }

  const createDialog = {
    createLoading,
    openCreateDialog,
    handleOpenCreateDialog: props.handleOpenCreateDialog,
    handleCloseCreateDialog: props.handleCloseCreateDialog,
    handleSubmitCreateDialog: props.handleSubmitCreateDialog
  }

  const confirmDialog = {
    openConfirmDialog: props.openConfirmDialog,
    handleOpenConfirmDialog: props.handleOpenConfirmDialog,
    handleCloseConfirmDialog: props.handleCloseConfirmDialog,
    handleSendConfirmDialog: props.handleSendConfirmDialog
  }

  const updateDialog = {
    initialValues: (() => {
      if (!detail || openCreateDialog) {
        return {
          contacts: [{}]
        }
      }

      const contacts = _(detail).get('contacts').map((contact) => {
        return {
          name: _.get(contact, 'name'),
          email: _.get(contact, 'email'),
          telephone: _.get(contact, 'telephone'),
          id: _.get(contact, 'id')

        }
      })

      return {
        name: _.get(detail, 'name'),
        from: {
          value: _.get(detail, 'from')
        },
        address: _.get(detail, 'address'),
        sphere: _.get(detail, 'sphere'),
        contacts: _.union(contacts, [{}]),
        inBlacklist: _.get(detail, 'inBlacklist')
      }
    })(),
    updateLoading: detailLoading || updateLoading,
    openUpdateDialog,
    handleOpenUpdateDialog: props.handleOpenUpdateDialog,
    handleCloseUpdateDialog: props.handleCloseUpdateDialog,
    handleSubmitUpdateDialog: props.handleSubmitUpdateDialog
  }

  const tabData = {
    tab,
    handleTabChange: props.handleTabChange
  }

  const listData = {
    data: _.get(list, 'results'),
    listLoading
  }

  const detailData = {
    id: detailId,
    data: detail,
    detailLoading,
    handleCloseDetail: props.handleCloseDetail
  }

  return (
    <Layout {...layout}>
      <ClientGridList
        filter={filter}
        filterDialog={filterDialog}
        listData={listData}
        detailData={detailData}
        tabData={tabData}
        createDialog={createDialog}
        confirmDialog={confirmDialog}
        updateDialog={updateDialog}
      />
    </Layout>
  )
})

export default ClientList
