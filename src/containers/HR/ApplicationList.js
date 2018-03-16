import React from 'react'
import _ from 'lodash'
import sprintf from 'sprintf'
import {reset} from 'redux-form'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout/index'
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import {
    APPLICATION_CREATE_DIALOG_OPEN,
    APPLICATION_UPDATE_DIALOG_OPEN,
    ApplicationGridList
} from '../../components/HR/Application/index'
import {
    applicationCreateAction,
    applicationUpdateAction,
    applicationListFetchAction,
    applicationDeleteAction,
    applicationItemFetchAction,
    usersListFetchAction,
    privilegeListFetchAction
} from '../../actions/HR/application'
import {openSnackbarAction} from '../../actions/snackbar'
import t from '../../helpers/translate'
import {APPLICATION_FILTER_KEY, APPLICATION_FILTER_OPEN} from '../../components/HR/Application'
import {PRICE_FILTER_KEY} from '../../components/Price'
import numberFormat from '../../helpers/numberFormat'
import moment from 'moment'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['application', 'item', 'data'])
        const detailLoading = _.get(state, ['application', 'item', 'loading'])
        const createLoading = _.get(state, ['application', 'create', 'loading'])
        const updateLoading = _.get(state, ['application', 'update', 'loading'])
        const list = _.get(state, ['application', 'list', 'data'])
        const listLoading = _.get(state, ['application', 'list', 'loading'])
        const privilegeList = _.get(state, ['application', 'privilege', 'data'])
        const privilegeListLoading = _.get(state, ['application', 'privilege', 'loading'])
        const usersList = _.get(state, ['users', 'list', 'data'])
        const usersListLoading = _.get(state, ['users', 'list', 'loading'])
        const createForm = _.get(state, ['form', 'ApplicationCreateForm'])
        const filter = filterHelper(list, pathname, query)

        return {
            list,
            listLoading,
            detail,
            detailLoading,
            createLoading,
            updateLoading,
            usersList,
            usersListLoading,
            privilegeList,
            privilegeListLoading,
            filter,
            createForm
        }
    }),
    withState('openConfirmDialog', 'setOpenConfirmDialog', false),
    withState('openRecruiterList', 'setOpenRecruiterList', false),

    withPropsOnChange((props, nextProps) => {
        return props.list && props.filter.filterRequest() !== nextProps.filter.filterRequest()
    }, ({dispatch, filter}) => {
        dispatch(applicationListFetchAction(filter))
    }),

    withPropsOnChange((props, nextProps) => {
        const applicationId = _.get(nextProps, ['params', 'applicationId'])
        return applicationId && _.get(props, ['params', 'applicationId']) !== applicationId
    }, ({dispatch, params}) => {
        const applicationId = _.toInteger(_.get(params, 'applicationId'))
        applicationId && dispatch(applicationItemFetchAction(applicationId))
    }),

    withPropsOnChange((props, nextProps) => {
        const prevOpen = _.get(props, ['openRecruiterList'])
        const nextOpen = _.get(nextProps, ['openRecruiterList'])
        const usersList = _.get(nextProps, ['usersList'])
        return nextOpen !== prevOpen && nextOpen === true && !usersList
    }, ({dispatch, openRecruiterList}) => {
        if (openRecruiterList) {
            dispatch(usersListFetchAction())
        }
    }),

    withPropsOnChange((props, nextProps) => {
        const prevCreate = toBoolean(_.get(props, ['location', 'query', APPLICATION_CREATE_DIALOG_OPEN]))
        const nextCreate = toBoolean(_.get(nextProps, ['location', 'query', APPLICATION_CREATE_DIALOG_OPEN]))
        const prevUpdate = toBoolean(_.get(props, ['location', 'query', APPLICATION_UPDATE_DIALOG_OPEN]))
        const nextUpdate = toBoolean(_.get(nextProps, ['location', 'query', APPLICATION_UPDATE_DIALOG_OPEN]))
        const privilegeList = _.get(nextProps, ['privilegeList'])
        return ((prevCreate !== nextCreate && nextCreate === true) || (prevUpdate !== nextUpdate && nextUpdate === true)) && !privilegeList
    }, ({dispatch, location: {query}}) => {
        const openCreate = toBoolean(_.get(query, APPLICATION_CREATE_DIALOG_OPEN))
        const openUpdate = toBoolean(_.get(query, APPLICATION_UPDATE_DIALOG_OPEN))
        if (openCreate || openUpdate) {
            dispatch(privilegeListFetchAction())
        }
    }),

    withHandlers({
        handleOpenFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[APPLICATION_FILTER_OPEN]: true})})
        },

        handleCloseFilterDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[APPLICATION_FILTER_OPEN]: false})})
        },

        handleClearFilterDialog: props => () => {
            const {location: {pathname}, dispatch} = props
            hashHistory.push({pathname, query: {}})
            dispatch(reset('ApplicationFilterForm'))
        },

        handleSubmitFilterDialog: props => () => {
            const {filter, filterForm} = props
            const typeParent = _.get(filterForm, ['values', 'typeParent', 'value']) || null
            const typeChild = _.get(filterForm, ['values', 'typeChild', 'value']) || null
            const measurement = _.get(filterForm, ['values', 'measurement']) || null
            const withoutNetCost = _.get(filterForm, ['values', 'withoutNetCost']) || null

            filter.filterBy({
                [APPLICATION_FILTER_OPEN]: false,
                [APPLICATION_FILTER_KEY.TYPE_PARENT]: typeParent,
                [APPLICATION_FILTER_KEY.TYPE_CHILD]: typeParent && typeChild,
                [APPLICATION_FILTER_KEY.MEASUREMENT]: _.join(measurement, '-'),
                [APPLICATION_FILTER_KEY.WITHOUT_NET_COST]: withoutNetCost
            })
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
            dispatch(applicationDeleteAction(detail.id))
                .then(() => {
                    setOpenConfirmDialog(false)
                    dispatch(applicationListFetchAction(filter))
                    return dispatch(openSnackbarAction({message: t('Успешно удалено')}))
                })
                .catch(() => {
                    return dispatch(openSnackbarAction({message: t('Удаление невозможно из-за связи с другими данными')}))
                })
        },

        handleOpenCreateDialog: props => () => {
            const {dispatch, location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[APPLICATION_CREATE_DIALOG_OPEN]: true})})
            dispatch(reset('ApplicationCreateForm'))
        },

        handleCloseCreateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[APPLICATION_CREATE_DIALOG_OPEN]: false})})
        },

        handleSubmitCreateDialog: props => () => {
            const {dispatch, createForm, filter, location: {pathname}} = props

            return dispatch(applicationCreateAction(_.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[APPLICATION_CREATE_DIALOG_OPEN]: false})})
                    dispatch(applicationListFetchAction(filter))
                })
        },

        handleOpenUpdateDialog: props => (id) => {
            const {filter} = props
            hashHistory.push({
                pathname: sprintf(ROUTER.HR_APPLICATION_ITEM_PATH, id),
                query: filter.getParams({[APPLICATION_UPDATE_DIALOG_OPEN]: true})
            })
        },

        handleCloseUpdateDialog: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[APPLICATION_UPDATE_DIALOG_OPEN]: false})})
        },

        handleSubmitUpdateDialog: props => () => {
            const {dispatch, createForm, filter} = props
            const applicationId = _.toInteger(_.get(props, ['params', 'applicationId']))

            return dispatch(applicationUpdateAction(applicationId, _.get(createForm, ['values'])))
                .then(() => {
                    return dispatch(applicationItemFetchAction(applicationId))
                })
                .then(() => {
                    return dispatch(openSnackbarAction({message: t('Успешно сохранено')}))
                })
                .then(() => {
                    hashHistory.push(filter.createURL({[APPLICATION_UPDATE_DIALOG_OPEN]: false}))
                    dispatch(applicationListFetchAction(filter))
                })
        },

        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.HR_APPLICATION_LIST_URL, query: filter.getParams()})
        }
    })
)

const ApplicationList = enhance((props) => {
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
        openRecruiterList,
        setOpenRecruiterList,
        usersList,
        usersListLoading,
        privilegeList,
        privilegeListLoading
    } = props

    const openFilterDialog = toBoolean(_.get(location, ['query', APPLICATION_FILTER_OPEN]))
    const openCreateDialog = toBoolean(_.get(location, ['query', APPLICATION_CREATE_DIALOG_OPEN]))
    const openUpdateDialog = toBoolean(_.get(location, ['query', APPLICATION_UPDATE_DIALOG_OPEN]))
    const detailId = _.toInteger(_.get(params, 'applicationId'))

    const typeParent = _.toNumber(_.get(location, ['query', PRICE_FILTER_KEY.TYPE_PARENT]))
    const typeChild = _.toNumber(_.get(location, ['query', PRICE_FILTER_KEY.TYPE_CHILD]))
    const measurement = _.get(location, ['query', PRICE_FILTER_KEY.MEASUREMENT])
    const withoutNetCost = toBoolean(_.get(location, ['query', PRICE_FILTER_KEY.WITHOUT_NET_COST]))

    const filterDialog = {
        initialValues: {
            typeParent: {value: typeParent},
            typeChild: {value: typeChild},
            measurement: measurement && _.map(_.split(measurement, '-'), (item) => {
                return _.toNumber(item)
            }),
            withoutNetCost: withoutNetCost
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

    const isSelectedPrivileges = _.map(_.get(privilegeList, 'results'), (obj) => {
        const userSelectedPrivilege = _.find(_.get(detail, 'privileges'), {'id': obj.id})
        if (!openCreateDialog && _.get(userSelectedPrivilege, 'id') === obj.id) {
            return {id: obj.id, selected: true}
        }
        return {id: obj.id, selected: false}
    })

    const createDialog = {
        createLoading,
        openCreateDialog,
        handleOpenCreateDialog: props.handleOpenCreateDialog,
        handleCloseCreateDialog: props.handleCloseCreateDialog,
        handleSubmitCreateDialog: props.handleSubmitCreateDialog
    }

    const updateDialog = {
        initialValues: (() => {
            if (!detail || openCreateDialog) {
                return {
                    languages: [{}],
                    privileges: isSelectedPrivileges
                }
            }
            const ageMin = _.get(detail, 'ageMin')
            const ageMax = _.get(detail, 'ageMax')
            const businessTrip = _.get(detail, 'businessTrip')
            const client = _.get(detail, ['client', 'id'])
            const deadline = moment(_.get(detail, 'deadline')).toDate()
            const deadlineTime = moment(_.get(detail, 'deadline')).toDate()
            const education = _.get(detail, 'education')
            const experience = _.get(detail, 'experience')
            const levelPc = _.get(detail, 'levelPc')
            const workSchedule = _.get(detail, 'mode')
            const planningDate = moment(_.get(detail, 'planningDate')).toDate()
            const position = _.get(detail, ['position', 'id'])
            const realSalaryMin = numberFormat(_.get(detail, 'realSalaryMin'))
            const realSalaryMax = numberFormat(_.get(detail, 'realSalaryMax'))
            const recruiter = _.get(detail, ['recruiter'])
            const responsibility = _.get(detail, 'responsibility')
            const sex = _.get(detail, 'sex')
            const skills = _.map(_.get(detail, 'skills'), (item) => _.get(item, 'name'))
            const trialSalaryMin = numberFormat(_.get(detail, 'trialSalaryMin'))
            const trialSalaryMax = numberFormat(_.get(detail, 'trialSalaryMax'))
            return {
                age: {
                    min: ageMin,
                    max: ageMax
                },
                businessTrip,
                client: {
                    value: client
                },
                education: {
                    value: education
                },
                experience,
                deadline,
                deadlineTime,
                levelPc: {
                    value: levelPc
                },
                planningDate,
                position: {
                    value: position
                },
                privileges: isSelectedPrivileges,
                trialSalary: {
                    min: trialSalaryMin,
                    max: trialSalaryMax
                },
                realSalary: {
                    min: realSalaryMin,
                    max: realSalaryMax
                },
                responsibility,
                sex: {
                    value: sex
                },
                schedule: {
                    value: workSchedule
                },
                skills,
                recruiter
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

    const usersData = {
        list: _.get(usersList, 'results'),
        loading: usersListLoading
    }

    const privilegeData = {
        list: _.get(privilegeList, 'results'),
        loading: privilegeListLoading
    }

    const detailData = {
        id: detailId,
        data: detail,
        detailLoading,
        handleCloseDetail: props.handleCloseDetail
    }

    return (
        <Layout {...layout}>
            <ApplicationGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                filterDialog={filterDialog}
                createDialog={createDialog}
                confirmDialog={confirmDialog}
                updateDialog={updateDialog}
                openRecruiterList={openRecruiterList}
                setOpenRecruiterList={setOpenRecruiterList}
                usersData={usersData}
                privilegeData={privilegeData}
            />
        </Layout>
    )
})

export default ApplicationList
