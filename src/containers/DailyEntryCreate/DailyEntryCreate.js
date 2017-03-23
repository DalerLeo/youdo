import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr'
import {hashHistory} from 'react-router'
import {toasterError} from '../../helpers/apiErrorsHandler'
import Layout from '../../components/Layout'
import DailyEntryForm from '../../components/DailyEntryForm'
import * as ROUTE from '../../constants/routes'
import {dailyEntryCreateAction} from '../../actions/dailyEntry'

const DailyEntryCreate = (props) => {
    const {dispatch, loading, form, layout} = props
    const onSubmit = (event) => {
        event.preventDefault()
        dispatch(dailyEntryCreateAction(form.values))
            .then(() => {
                toastr.success('Success', 'Data is successfully saved')
                hashHistory.push(ROUTE.DAILY_ENTRY_LIST_URL)
            })
            .catch((response) => {
                toastr.error('Invalid data', toasterError(response))
            })
    }

    return (
        <Layout {...layout}>
            <DailyEntryForm loading={loading} onSubmit={onSubmit} />
        </Layout>
    )
}

export default connect((state) => {
    return {
        loading: _.get(state, ['dailyEntry', 'create', 'loading']),
        form: _.get(state, ['form', 'DailyEntryForm'])
    }
})(DailyEntryCreate)
