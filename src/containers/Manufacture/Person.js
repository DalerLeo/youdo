import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {reset} from 'redux-form'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import updateStore from '../../helpers/updateStore'
import * as actionTypes from '../../constants/actionTypes'
import toBoolean from '../../helpers/toBoolean'
import {
    OPEN_USER_CREATE_DIALOG,
    OPEN_USER_UPDATE_DIALOG,
    OPEN_USER_CONFIRM_DIALOG,
    ManufacturePersonWrapper
} from '../../components/Manufacture'
import ManufactureWrapper from './Wrapper'
import {PERSON_FILTER_KEY, PERSON_FILTER_OPEN} from '../../components/Manufacture/PersonFilterForm'
import {
    userShiftCreateAction,
    userShiftListFetchAction,
    userShiftUpdateAction,
    userShiftDeleteAction
} from '../../actions/userShift'
import {openSnackbarAction} from '../../actions/snackbar'
import {openErrorAction} from '../../actions/error'
import t from '../../helpers/translate'

const MINUS_ONE = -1
const ZERO = 0
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['manufacture', 'list', 'data'])
        const listLoading = _.get(state, ['manufacture', 'list', 'loading'])
        const filter = filterHelper(list, pathname, query)
        const userShiftList = _.get(state, ['userShift', 'list', 'data'])
        const userShiftLoading = _.get(state, ['userShift', 'list', 'loading'])
        const filterUser = filterHelper(userShiftList, pathname, query)
        const staffCreateForm = _.get(state, ['form', 'ManufactureCreateUserForm'])
        const filterPersonForm = _.get(state, ['form', 'PersonFilterForm'])

        return {
            query,
            pathname,
            list,
            filter,
            listLoading,
            userShiftList,
            userShiftLoading,
            filterUser,
            staffCreateForm,
            filterPersonForm
        }
    }),
    withPropsOnChange((props, nextProps) => {
        const except = {
            openUpdateDialog: null,
            personId: null,
            openUserDeleteDialog: null
        }
        const manufactureId = _.toInteger(_.get(props, ['params', 'manufactureId']))
        const nextManufactureId = _.toInteger(_.get(nextProps, ['params', 'manufactureId']))
        return (props.filterUser.filterRequest(except) !== nextProps.filterUser.filterRequest(except) && nextManufactureId > ZERO) ||
            (manufactureId !== nextManufactureId && nextManufactureId)
    }, ({dispatch, filterUser, params}) => {
        const manufactureId = _.toInteger(_.get(params, 'manufactureId'))
        if (manufactureId > ZERO) {
            dispatch(userShiftListFetchAction(filterUser, manufactureId))
        }
    }),

    withHandlers({
        handleOpenPersonFilterDialog: props => () => {
            const {location: {pathname}, filterUser} = props
            hashHistory.push({pathname, query: filterUser.getParams({[PERSON_FILTER_OPEN]: true})})
        },
        handleClosePersonFilterDialog: props => () => {
            const {location: {pathname}, filterUser} = props
            hashHistory.push({pathname, query: filterUser.getParams({[PERSON_FILTER_OPEN]: false})})
        },
        handleClearPersonFilterDialog: props => () => {
            const {location: {pathname}} = props
            hashHistory.push({pathname, query: {}})
        },
        handleSubmitPersonFilterDialog: props => () => {
            const {filterUser, filterPersonForm} = props
            const shift = _.get(filterPersonForm, ['values', 'shift']) || null

            filterUser.filterBy({
                [PERSON_FILTER_OPEN]: false,
                [PERSON_FILTER_KEY.SHIFT]: _.join(shift, '-')
            })
        },

        handleOpenUserCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filterUser} = props
            hashHistory.push({pathname, query: filterUser.getParams({[OPEN_USER_CREATE_DIALOG]: true})})
            dispatch(reset('ManufactureCreateUserForm'))
        },
        handleCloseUserCreateDialog: props => () => {
            const {location: {pathname}, filterUser} = props
            hashHistory.push({pathname, query: filterUser.getParams({[OPEN_USER_CREATE_DIALOG]: false})})
        },
        handleSubmitUserCreateDialog: props => () => {
            const {dispatch, staffCreateForm, filterUser, location: {pathname}, params} = props
            const manufactureId = _.get(params, 'manufactureId')
            return dispatch(userShiftCreateAction(_.get(staffCreateForm, ['values']), manufactureId))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filterUser.getParams({[OPEN_USER_CREATE_DIALOG]: false})})
                    dispatch(userShiftListFetchAction(filterUser, manufactureId))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenUserUpdateDialog: props => (id) => {
            const {filterUser, location: {pathname}} = props
            hashHistory.push({pathname, query: filterUser.getParams({[OPEN_USER_UPDATE_DIALOG]: true, 'personId': id})})
        },
        handleCloseUserUpdateDialog: props => () => {
            const {location: {pathname}, filterUser} = props
            hashHistory.push({pathname, query: filterUser.getParams({[OPEN_USER_UPDATE_DIALOG]: false, 'personId': -1})})
        },
        handleSubmitUserUpdateDialog: props => () => {
            const {dispatch, userShiftList, staffCreateForm, filterUser, params} = props
            const manufactureId = _.get(params, 'manufactureId')
            const personId = _.toNumber(_.get(props, ['location', 'query', 'personId']))
            return dispatch(userShiftUpdateAction(personId, _.get(staffCreateForm, ['values']), manufactureId))
                .then((data) => {
                    const detail = _.get(data, 'value')
                    updateStore(
                        personId,
                        userShiftList,
                        actionTypes.USER_SHIFT_LIST,
                        {
                            name: _.get(detail, 'name'),
                            shift: _.get(detail, 'shift')
                        })
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push(filterUser.createURL({[OPEN_USER_UPDATE_DIALOG]: false, 'personId': -1}))
                })
                .catch((error) => {
                    dispatch(openErrorAction({
                        message: error
                    }))
                })
        },

        handleOpenUserConfirmDialog: props => (id) => {
            const {filterUser, location: {pathname}} = props
            hashHistory.push({pathname, query: filterUser.getParams({[OPEN_USER_CONFIRM_DIALOG]: true, 'personId': id})})
        },
        handleCloseUserConfirmDialog: props => () => {
            const {location: {pathname}, filterUser} = props
            hashHistory.push({pathname, query: filterUser.getParams({[OPEN_USER_CONFIRM_DIALOG]: false, 'personId': -1})})
        },
        handleSendUserConfirmDialog: props => () => {
            const {dispatch, filterUser, location: {pathname}, params} = props
            const personId = _.toNumber(_.get(props, ['location', 'query', 'personId']) || '-1')
            const manufactureId = _.toNumber(_.get(params, 'manufactureId'))
            dispatch(userShiftDeleteAction(_.toInteger(personId)))
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
                })
                .then(() => {
                    hashHistory.push({
                        pathname,
                        query: filterUser.getParams({[OPEN_USER_CONFIRM_DIALOG]: false, 'personId': -1})
                    })
                    dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                    return dispatch(userShiftListFetchAction(filterUser, manufactureId))
                })
        },

        handleClickItem: props => (id) => {
            const {filterUser} = props
            hashHistory.push({pathname: sprintf(ROUTER.MANUFACTURE_PERSON_ITEM_PATH, id), query: filterUser.getParams()})
        }
    })
)

const ManufacturePersonList = enhance((props) => {
    const {
        filter,
        list,
        listLoading,
        userShiftList,
        userShiftLoading,
        filterUser,
        location,
        params,
        layout
    } = props

    const detailId = _.toInteger(_.get(params, 'manufactureId'))
    const shift = filterUser.getParam(PERSON_FILTER_KEY.SHIFT)
    const openCreateUser = toBoolean(_.get(location, ['query', OPEN_USER_CREATE_DIALOG]))
    const openPersonFilterDialog = toBoolean(_.get(location, ['query', PERSON_FILTER_OPEN]))
    const openUpdateUserDialog = toBoolean(_.get(location, ['query', OPEN_USER_UPDATE_DIALOG]))
    const openUserConfirmDialog = toBoolean(_.get(location, ['query', OPEN_USER_CONFIRM_DIALOG]))
    const personId = _.get(props, ['location', 'query', 'personId']) || MINUS_ONE

    const listData = {
        data: _.get(list, 'results'),
        listLoading,
        handleClickItem: props.handleClickItem
    }

    const detailData = {
        id: detailId,
        handleCloseDetail: props.handleCloseDetail
    }

    const personFilterDialog = {
        initialValues: {
            shift: shift && _.map(_.split(shift, '-'), (item) => {
                return _.toNumber(item)
            })
        },
        filterLoading: false,
        openFilterDialog: openPersonFilterDialog,
        handleOpenFilterDialog: props.handleOpenPersonFilterDialog,
        handleCloseFilterDialog: props.handleClosePersonFilterDialog,
        handleClearFilterDialog: props.handleClearPersonFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitPersonFilterDialog
    }

    const addUser = {
        open: openCreateUser,
        handleOpenDialog: props.handleOpenUserCreateDialog,
        handleCloseDialog: props.handleCloseUserCreateDialog,
        handleSubmitDialog: props.handleSubmitUserCreateDialog
    }
    const userShiftItem = _.find(_.get(userShiftList, 'results'), (o) => {
        return o.id === _.toInteger(personId)
    })

    const updateUser = {
        initialValues: (() => {
            if (!userShiftItem || openCreateUser) {
                return {}
            }
            return {
                user: {
                    value: _.get(userShiftItem, ['user', 'id'])
                },
                shift: {
                    value: _.get(userShiftItem, 'shift')
                }
            }
        })(),
        open: openUpdateUserDialog,
        handleOpenUpdateDialog: props.handleOpenUserUpdateDialog,
        handleCloseUpdateDialog: props.handleCloseUserUpdateDialog,
        handleSubmitUpdateDialog: props.handleSubmitUserUpdateDialog
    }
    const confirmUser = {
        open: openUserConfirmDialog,
        handleOpenConfirmDialog: props.handleOpenUserConfirmDialog,
        handleCloseConfirmDialog: props.handleCloseUserConfirmDialog,
        handleSendConfirmDialog: props.handleSendUserConfirmDialog
    }

    const personData = {
        userShiftItem,
        list: userShiftList,
        listLoading: userShiftLoading,
        filter: filterUser,
        filterDialog: personFilterDialog,
        createDialog: addUser,
        updateDialog: updateUser,
        confirmDialog: confirmUser
    }

    return (
        <Layout {...layout}>
            <ManufactureWrapper detailId={detailId} clickDetail={props.handleClickItem}>
                <ManufacturePersonWrapper
                    filter={filter}
                    personData={personData}
                    listData={listData}
                    detailData={detailData}
                />
            </ManufactureWrapper>
        </Layout>
    )
})

export default ManufacturePersonList
