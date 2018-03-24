import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import Layout from '../../components/Layout'
import {compose, withPropsOnChange, withHandlers} from 'recompose'
import * as ROUTER from '../../constants/routes'
import filterHelper from '../../helpers/filter'
import {
    LongListGridList
} from '../../components/HR/LongList'
import {
    getApplicationDetails
} from '../../actions/HR/longList'
import {RESUME_FILTER_KEY, RESUME_FILTER_OPEN} from '../../components/HR/Resume'
import {joinArray} from '../../helpers/joinSplitValues'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import {langQueryFormat} from '../../helpers/joinSplitLanguages'
import {ZERO} from '../../constants/backendConstants'

const enhance = compose(
    connect((state, props) => {
        const query = _.get(props, ['location', 'query'])
        const pathname = _.get(props, ['location', 'pathname'])
        const detail = _.get(state, ['application', 'item', 'data'])
        const detailLoading = _.get(state, ['application', 'item', 'loading'])
        const createForm = _.get(state, ['form', 'LongListCreateForm'])

        return {
            detail,
            detailLoading,
            createForm
        }
    }),

     withPropsOnChange((props, nextProps) => {
         const app = _.toInteger(_.get(props, ['location', 'query', 'application']))
         const nextApp = _.toInteger(_.get(nextProps, ['location', 'query', 'application']))
         return app !== nextApp && nextApp
     }, ({dispatch, location: {query}}) => {
         const app = _.toInteger(_.get(query, ['application']))
         if (app > ZERO) {
             dispatch(getApplicationDetails(app))
         }
     }),

    withHandlers({
        handleCloseDetail: props => () => {
            const {filter} = props
            hashHistory.push({pathname: ROUTER.HR_LONG_LIST_LIST_URL, query: filter.getParams()})
        }
    })
)

const LongList = enhance((props) => {
    const {
        location,
        list,
        listLoading,
        detail,
        detailLoading,
        filter,
        layout,
        params
    } = props

    const detailId = _.toInteger(_.get(params, 'longListId'))

    const listData = {
        data: _.get(list, 'results'),
        listLoading
    }

    const detailData = {
        id: detailId,
        data: detail,
        loading: detailLoading
    }

    const filterDialog = {
        openFilterDialog: true,
        handleOpenFilterDialog: props.handleOpenFilterDialog,
        handleCloseFilterDialog: props.handleCloseFilterDialog,
        handleClearFilterDialog: props.handleClearFilterDialog,
        handleSubmitFilterDialog: props.handleSubmitFilterDialog
    }

    return (
        <Layout {...layout}>
            <LongListGridList
                filter={filter}
                listData={listData}
                detailData={detailData}
                filterDialog={filterDialog}
            />
        </Layout>
    )
})

export default LongList
