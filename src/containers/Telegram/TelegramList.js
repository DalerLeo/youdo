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
import {splitToArray, joinArray} from '../../helpers/joinSplitValues'
import updateStore from '../../helpers/updateStore'
import moment from 'moment'
import * as actionTypes from '../../constants/actionTypes'
import {
    TELEGRAM_CREATE_DIALOG_OPEN,
    TELEGRAM_UPDATE_DIALOG_OPEN,
    TelegramGridList,
    TELEGRAM_FILTER_OPEN,
    TELEGRAM_FILTER_KEY,
    TELEGRAM_LOGS_DIALOG_OPEN,
    TELEGRAM_DEACTIVATE_ID
} from '../../components/Telegram'
import {
    telegramCreateAction,
    telegramUpdateAction,
    telegramListFetchAction,
    telegramDeleteAction,
    telegramItemFetchAction,
    telegramLogsFetchAction
} from '../../actions/telegram'
import {openErrorAction} from '../../actions/error'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'

const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const logsData = _.get(state, ['telegram', 'logs', 'data'])
        const logsLoading = _.get(state, ['telegram', 'logs', 'loading'])
        const createLoading = _.get(state, ['telegram', 'create', 'loading'])
        const createData = _.get(state, ['telegram', 'create', 'data'])
        const updateLoading = _.get(state, ['telegram', 'update', 'loading'])
        const list = _.get(state, ['telegram', 'list', 'data'])
        const listLoading = _.get(state, ['telegram', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'TelegramCreateForm'])
        const filterForm = _.get(state, ['form', 'TelegramFilterForm'])
        const filter = filterHelper(list, pathname, query)
        const filterItem = filterHelper(logsData, pathname, query, {'page': 'dPage', 'pageSize': 'dPageSize'})

        return {
            list,
            listLoading,
            createLoading,
            updateLoading,
            filter,
            createForm,
            createData,
            filterForm,
            filterItem,
            logsLoading,
            logsData
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            openLogsDialog: null,
            deactivateID: null
        }
        return props.list && props.filter.filterRequest(except) !== nextProps.filter.filterRequest(except)
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

    withPropsOnChange((props, nextProps) => {
        const except = {
            page: null,
            pageSize: null
        }
        return props.filterItem.filterRequest(except) !== nextProps.filterItem.filterRequest(except)
    }, ({dispatch, filterItem, location}) => {
        const id = _.toInteger(_.get(location, ['query', TELEGRAM_LOGS_DIALOG_OPEN]))
        if (id > ZERO) {
            dispatch(telegramLogsFetchAction(filterItem))
        }
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
        handleOpenConfirmDialog: props => (id) => {
            const {location: {pathname}, filter, setOpenConfirmDialog} = props
            hashHistory.push({pathname, query: filter.getParams({[TELEGRAM_DEACTIVATE_ID]: id})})
            setOpenConfirmDialog(true)
        },

        handleCloseConfirmDialog: props => () => {
            const {location: {pathname}, filter, setOpenConfirmDialog} = props
            hashHistory.push({pathname, query: filter.getParams({[TELEGRAM_DEACTIVATE_ID]: null})})
            setOpenConfirmDialog(false)
        },
        handleSendConfirmDialog: props => () => {
            const {location: {pathname}, dispatch, params, setOpenConfirmDialog, filter} = props
            const detailID = _.toInteger(_.get(params, 'telegramId'))
            dispatch(telegramDeleteAction(detailID))
                .then(() => {
                    setOpenConfirmDialog(false)
                    hashHistory.push({pathname, query: filter.getParams({[TELEGRAM_DEACTIVATE_ID]: null})})
                    dispatch(telegramListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
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
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
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
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
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
            copy ? dispatch(openSnackbarAction({message: t('Cкопировано')})) : null
        },
        handleCopyLinkInList: props => (token) => {
            const {dispatch} = props
            const value = 't.me/markets_bot?start=' + token
            let textField = document.createElement('textarea')
            textField.innerText = value
            document.body.appendChild(textField)
            textField.select()
            const copy = document.execCommand('copy')
            textField.remove()
            copy ? dispatch(openSnackbarAction({message: t('Ссылка скопирована')})) : null
        },
        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TELEGRAM_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TELEGRAM_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },
        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const createdBy = _.get(filterForm, ['values', 'createdBy']) || null
            const market = _.get(filterForm, ['values', 'market']) || null
            const createdFromDate = _.get(filterForm, ['values', 'createdDate', 'fromDate']) || null
            const createdToDate = _.get(filterForm, ['values', 'createdDate', 'toDate']) || null
            const activatedFromDate = _.get(filterForm, ['values', 'activatedDate', 'fromDate']) || null
            const activatedToDate = _.get(filterForm, ['values', 'activatedDate', 'toDate']) || null
            filter.filterBy({
                [TELEGRAM_FILTER_OPEN]: false,
                [TELEGRAM_FILTER_KEY.CREATED_BY]: joinArray(createdBy),
                [TELEGRAM_FILTER_KEY.MARKET]: joinArray(market),
                [TELEGRAM_FILTER_KEY.ACTIVATED_FROM_DATE]: activatedFromDate && activatedFromDate.format('YYYY-MM-DD'),
                [TELEGRAM_FILTER_KEY.ACTIVATED_TO_DATE]: activatedToDate && activatedToDate.format('YYYY-MM-DD'),
                [TELEGRAM_FILTER_KEY.CREATED_FROM_DATE]: createdFromDate && createdFromDate.format('YYYY-MM-DD'),
                [TELEGRAM_FILTER_KEY.CREATED_TO_DATE]: createdToDate && createdToDate.format('YYYY-MM-DD')
            })
        },
        handleOpenLogsDialog: props => (id) => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TELEGRAM_LOGS_DIALOG_OPEN]: id})})
        },

        handleCloseLogsDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[TELEGRAM_LOGS_DIALOG_OPEN]: false})})
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
        createData,
        filterItem,
        logsData,
        logsLoading
    } = props

    const openCreateDialog = toBoolean(_.get(location, ['query', TELEGRAM_CREATE_DIALOG_OPEN]))
    const openFilterDialog = toBoolean(_.get(location, ['query', TELEGRAM_FILTER_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', TELEGRAM_UPDATE_DIALOG_OPEN]))
    const openLogsDialog = _.get(location, ['query', TELEGRAM_LOGS_DIALOG_OPEN])
    const detailId = _.toInteger(_.get(params, 'telegramId'))
    const tab = _.get(params, 'tab')
    const market = (filter.getParam(TELEGRAM_FILTER_KEY.MARKET))
    const createdBy = filter.getParam(TELEGRAM_FILTER_KEY.CREATED_BY)
    const activatedFromDate = filter.getParam(TELEGRAM_FILTER_KEY.ACTIVATED_FROM_DATE)
    const activatedToDate = filter.getParam(TELEGRAM_FILTER_KEY.ACTIVATED_TO_DATE)
    const createdFromDate = filter.getParam(TELEGRAM_FILTER_KEY.CREATED_FROM_DATE)
    const createdToDate = filter.getParam(TELEGRAM_FILTER_KEY.CREATED_TO_DATE)
    const createDialog = {
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
    }

    const filterDialog = {
        initialValues: {
            market: market && splitToArray(market),
            createdBy: createdBy && splitToArray(createdBy),
            activatedDate: {
                fromDate: activatedFromDate && moment(activatedFromDate, 'YYYY-MM-DD'),
                toDate: activatedToDate && moment(activatedToDate, 'YYYY-MM-DD')
            },
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
    const logsDialog = {
        logsData: _.get(logsData, 'results'),
        logsLoading,
        openLogsDialog,
        handleOpenLogsDialog: props.handleOpenLogsDialog,
        handleCloseLogsDialog: props.handleCloseLogsDialog
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

    const copyToClipBoard = {
        handleCopyToken: props.handleCopyToken,
        handleCopyLinkInList: props.handleCopyLinkInList
    }
    return (
        <Layout {...layout}>
            <TelegramGridList
                filter={filter}
                filterItem={filterItem}
                listData={listData}
                detailData={detailData}
                tabData={tabData}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                linkDialog={linkDialog}
                createDetails={createDetails}
                copyToClipBoard={copyToClipBoard}
                filterDialog={filterDialog}
                logsDialog={logsDialog}
            />
        </Layout>
    )
})

export default TelegramList
