import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr'
import {toasterError} from '../../helpers/apiErrorsHandler'
import Layout from '../../components/Layout'
import DailyEntryForm from '../../components/DailyEntryForm'
import {dailyEntryCreateAction} from '../../actions/dailyEntry'

const DailyEntryItem = (props) => {
    const {dispatch, loading, formValues, layout} = props
    const onSubmit = (event) => {
        event.preventDefault()
        dispatch(dailyEntryCreateAction(formValues))
            .then(() => {
                toastr.success('Successfully saved', '')
            })
            .catch((response) => {
                toastr.error('Invalid data', toasterError(response))
            })
    }

    return (
        <Layout {...layout}>
            <DailyEntryForm loading={loading} onSubmit={onSubmit}/>
        </Layout>
    )
}

export default connect((state) => {
    return {
        loading: _.get(state, ['dailyEntry', 'create', 'loading']),
        formValues: _.get(state, ['form', 'DailyReportForm', 'values'])
    }
})(DailyEntryItem)
