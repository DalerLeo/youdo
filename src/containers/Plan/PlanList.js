import React from 'react'
import _ from 'lodash'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import {connect} from 'react-redux'
import Layout from '../../components/Layout'
import {hashHistory} from 'react-router'
import filterHelper from '../../helpers/filter'
import toBoolean from '../../helpers/toBoolean'
import PlanWrapper from '../../components/Plan/PlanWrapper'
import {ADD_PLAN} from '../../components/Plan'
import {
    planCreateAction,
    planListFetchAction,
    planListSearchFetchAction,
    planItemFetchAction
} from '../../actions/plan'
import {openSnackbarAction} from '../../actions/snackbar'
const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const list = _.get(state, ['plan', 'list', 'data'])
        const listLoading = _.get(state, ['plan', 'list', 'loading'])
        const detail = _.get(state, ['plan', 'item', 'data'])
        const detailLoading = _.get(state, ['plan', 'item', 'loading'])
        const stat = _.get(state, ['plan', 'statistics', 'data'])
        const statLoading = _.get(state, ['plan', 'statistics', 'loading'])
        const createForm = _.get(state, ['form', 'PlanCreateForm', 'values'])
        const filter = filterHelper(list, pathname, query)
        return {
            query,
            pathname,
            list,
            listLoading,
            stat,
            statLoading,
            detail,
            detailLoading,
            createForm,
            filter
        }
    }),

    withHandlers({
        handleOpenAddPlan: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_PLAN]: true})})
        },

        handleCloseAddPlan: props => () => {
            const {location: {pathname}, filter} = props
            hashHistory.push({pathname, query: filter.getParams({[ADD_PLAN]: false})})
        },

        handleSubmitAddPlan: props => () => {
            const {location: {pathname}, dispatch, createForm, filter} = props

            return dispatch(planCreateAction(createForm))
                .then(() => {
                    return dispatch(openSnackbarAction({message: 'Зона успешно добавлена'}))
                })
                .then(() => {
                    hashHistory.push({pathname, query: filter.getParams({[ADD_PLAN]: false})})
                    dispatch(planListFetchAction(filter))
                })
        }
    })
)

const PlanList = enhance((props) => {
    const {
        filter,
        list,
        listLoading,
        location,
        layout,
        params,
        stat,
        statLoading,
        detail,
        detailLoading
    } = props

    const openAddPlan = toBoolean(_.get(location, ['query', ADD_PLAN]))
    const openDetail = !_.isEmpty(_.get(params, 'planId'))
    const detailId = _.toInteger(_.get(params, 'planId'))

    const addPlan = {
        openAddPlan,
        handleOpenAddPlan: props.handleOpenAddPlan,
        handleCloseAddPlan: props.handleCloseAddPlan,
        handleSubmitAddPlan: props.handleSubmitAddPlan
    }

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const statData = {
        data: stat,
        statLoading
    }

    const detailData = {
        openDetail,
        id: detailId,
        data: detail,
        detailLoading
    }

    return (
        <Layout {...layout}>
            <PlanWrapper
                filter={filter}
                listData={listData}
                statData={statData}
                addPlan={addPlan}
                detailData={detailData}
            />
        </Layout>
    )
})

export default PlanList
