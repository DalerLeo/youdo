import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr'
import {hashHistory} from 'react-router'
import {toasterError} from '../../helpers/apiErrorsHandler'
import * as ROUTE from '../../constants/routes'
import Layout from '../../components/Layout'
import BalanceCreateForm from '../../components/BalanceCreateForm'
import {balanceCreateAction} from '../../actions/balance'

const BalanceCreate = (props) => {
    const {dispatch, loading, form, layout} = props
    const onSubmit = (event) => {
        event.preventDefault()
        dispatch(balanceCreateAction(form.values))
            .then(() => {
                toastr.success('Success', 'Data is successfully saved')
                hashHistory.push(ROUTE.BALANCE_LIST_URL)
            })
            .catch((response) => {
                toastr.error('Invalid data', toasterError(response))
            })
    }
    return (
        <Layout {...layout}>
            <div>
                <BalanceCreateForm loading={loading} onSubmit={onSubmit}/>
            </div>
        </Layout>
    )
}

export default connect((state) => {
    return {
        loading: _.get(state, ['balance', 'create', 'loading']),
        form: _.get(state, ['form', 'BalanceCreateForm'])
    }
})(BalanceCreate)
