import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {reset} from 'redux-form'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    PROVIDER_CREATE_DIALOG_OPEN,
    PROVIDER_UPDATE_DIALOG_OPEN,
    ProviderGridList
} from '../../components/Provider'
import {
    providerCreateAction,
    providerUpdateAction,
    providerListFetchAction,
    providerDeleteAction,
    providerItemFetchAction
} from '../../actions/provider'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['provider', 'item', 'data'])
        const detailLoading = _.get(state, ['provider', 'item', 'loading'])
        const createLoading = _.get(state, ['provider', 'create', 'loading'])
        const updateLoading = _.get(state, ['provider', 'update', 'loading'])
        const list = _.get(state, ['provider', 'list', 'data'])
        const listLoading = _.get(state, ['provider', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'ProviderCreateForm'])
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
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(providerListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const providerId = _.get(nextProps, ['params', 'providerId'])
        return providerId && _.get(props, ['params', 'providerId']) !== providerId
    }, ({dispatch, params}) => {
        const providerId = _.toInteger(_.get(params, 'providerId'))
        providerId && dispatch(providerItemFetchAction(providerId))
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),

    withHandlers({
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
            dispatch(providerDeleteAction(detail.id))
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(providerListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PROVIDER_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('ProviderCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PROVIDER_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(providerCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[PROVIDER_CREATE_DIALOG_OPEN]: false})})
                    dispatch(providerListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.PROVIDER_ITEM_PATH, id),
                query: filter.getParams({[PROVIDER_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[PROVIDER_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const providerId = _.toInteger(_.get(props, ['params', 'providerId']))

            return dispatch(providerUpdateAction(providerId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(providerItemFetchAction(providerId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[PROVIDER_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(providerListFetchAction(filter))
                })
        },

        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.PROVIDER_LIST_URL, query: filter.getParams()})
        }
    })
)

const ProviderList = enhance((props) => {
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

    const openCreateDialog = toBoolean(_.get(location, ['query', PROVIDER_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', PROVIDER_UPDATE_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'providerId'))

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
                    phone: _.get(contact, 'phone'),
                    id: _.get(contact, 'id')
                }
            })
            return {
                name: _.get(detail, 'name'),
                address: _.get(detail, 'address'),
                contacts: _.union(contacts, [{}])
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
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    return (
        <Layout {...layout}>
            <ProviderGridList
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

export default ProviderList
