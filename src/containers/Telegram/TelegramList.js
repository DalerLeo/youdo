import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {connect} from 'react-redux'
import {reset} from 'redux-form'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import updateStore from '../../helpers/updateStore'
import * as actionTypes from '../../constants/actionTypes'
import {
    TELEGRAM_CREATE_DIALOG_OPEN,
    TELEGRAM_UPDATE_DIALOG_OPEN,
    TelegramGridList
} from '../../components/Telegram'
import {
    telegramCreateAction,
    telegramUpdateAction,
    telegramListFetchAction,
    telegramDeleteAction,
    telegramItemFetchAction
} from '../../actions/telegram'
import {openErrorAction} from '../../actions/error'
import {openSnackbarAction} from '../../actions/snackbar'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['telegram', 'item', 'data'])
        const detailLoading = _.get(state, ['telegram', 'item', 'loading'])
        const createLoading = _.get(state, ['telegram', 'create', 'loading'])
        const createData = _.get(state, ['telegram', 'create', 'data'])
        const updateLoading = _.get(state, ['telegram', 'update', 'loading'])
        const list = _.get(state, ['telegram', 'list', 'data'])
        const listLoading = _.get(state, ['telegram', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'TelegramCreateForm'])
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
            createData
        }
    }),
    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(telegramListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const telegramId = _.get(nextProps, ['params', 'telegramId'])
        return telegramId && _.get(props, ['params', 'telegramId']) !== telegramId
    }, ({dispatch, params}) => {
        const telegramId = _.toInteger(_.get(params, 'telegramId'))
        telegramId && dispatch(telegramItemFetchAction(telegramId))
    }),

    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
    withState('openLinkDialog', 'setOpenLinkDialog', false),

    withHandlers({
        handleActionEdit: props => () => {
            return null
        },

        handleOpenLinkDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(true)
        },

        handleCloseLinkDialog: props => () => {
            const {setOpenLinkDialog} = props
            setOpenLinkDialog(false)
        },
        handleOpenConfirmDialog: props => () => {
            const {setOpenLinkDialog} = props
            setOpenLinkDialog(true)
        },

        handleCloseConfirmDialog: props => () => {
            const {setOpenConfirmDialog} = props
            setOpenConfirmDialog(false)
        },
        handleSendConfirmDialog: props => () => {
            const {dispatch, detail, setOpenConfirmDialog, filter} = props
            dispatch(telegramDeleteAction(detail.id))
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(telegramListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: 'Успешно удалено'}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: 'Ошибка при удалении'}))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TELEGRAM_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('TelegramCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TELEGRAM_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, setOpenLinkDialog} = props

            return dispatch(telegramCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    dispatch(telegramListFetchAction(filter))
                    hashHistory.push(filter.createURL({[TELEGRAM_CREATE_DIALOG_OPEN]: false}))
                    setOpenLinkDialog(true)
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.TELEGRAM_ITEM_PATH, id),
                query: filter.getParams({[TELEGRAM_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TELEGRAM_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter, list} = props
            const telegramId = _.toInteger(_.get(props, ['params', 'telegramId']))

            return dispatch(telegramUpdateAction(telegramId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(telegramItemFetchAction(telegramId))
                        .then((data) => {
                            const detail = _.get(data, 'value')
                            return dispatch(updateStore(telegramId, list, actionTypes.TELEGRAM_LIST, {
                                address: _.get(detail, 'address'),
                                name: _.get(detail, 'name')
                            }))
                        })
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Успешно сохранено'}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[TELEGRAM_UPDATE_DIALOG_OPEN]: false}))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.TELEGRAM_LIST_URL, query: filter.getParams()})
        },
        handleCopyToken: props => () => {
            const {createData, dispatch} = props
            const value = 't.me/markets_bot?start=' + _.get(createData, 'token')
            let textField = document.createElement('textarea')
            textField.innerText = value
            document.body.appendChild(textField)
            textField.select()
            const copy = document.execCommand('copy')
            textField.remove()
            copy ? dispatch(openSnackbarAction({message: 'Cкопировано'})) : null
        }
    })
)

const TelegramList = enhance((props) => {
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
        params,
        createData
    } = props

    const openCreateDialog = toBoolean(_.get(location, ['query', TELEGRAM_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', TELEGRAM_UPDATE_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'telegramId'))
    const tab = _.get(params, 'tab')

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
    const linkDialog = {
        openLinkDialog: props.openLinkDialog,
        handleOpenLinkDialog: props.handleOpenLinkDialog,
        handleCloseLinkDialog: props.handleCloseLinkDialog
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
                contacts: _.union(contacts, [{}])
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
    const createDetails = {
        createData,
        createLoading
    }

    return (
        <Layout {...layout}>
            <TelegramGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                tabData={tabData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                linkDialog={linkDialog}
                createDetails={createDetails}
                copyToClipBoard={props.handleCopyToken}
            />
        </Layout>
    )
})

export default TelegramList
