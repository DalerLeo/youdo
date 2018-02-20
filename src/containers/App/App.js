import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {setTokenAction, signOutAction, setAuthConfirmAction} from '../../actions/signIn'
import {trackingListFetchAction} from '../../actions/tracking'
import DocumentTitle from 'react-document-title'
import {hashHistory} from 'react-router'
import {compose, withHandlers, withState} from 'recompose'
import * as ROUTES from '../../constants/routes'

const refreshAgentsList = 45000
@compose(
    connect(),
    withHandlers({
        handleSignOut: prop => (event) => {
            const {dispatch} = prop
            event.preventDefault()

            dispatch(signOutAction())
                .then(() => {
                    hashHistory.push(ROUTES.SIGN_IN)
                })
                .then(() => {
                    window.location.replace(ROUTES.DASHBOARD_URL)
                })
        }
    }),
    withState('scrollValue', 'updateScrollValue', false)
)
class App extends React.Component {
    constructor (props) {
        super(props)
        const pathname = _.get(props, ['location', 'pathname'])
        const {dispatch} = props
        dispatch(setTokenAction())
        dispatch(setAuthConfirmAction())
        if (pathname === '/' + ROUTES.TRACKING) {
            setInterval(() => {
                dispatch(trackingListFetchAction())
            }, refreshAgentsList)
        }
    }

    componentWillReceiveProps (nextProps) {
        const props = this.props
        const prevLocation = _.get(props, ['location', 'pathname'])
        const nextLocation = _.get(nextProps, ['location', 'pathname'])
        const updateScrollValue = _.get(nextProps, 'updateScrollValue')
        if (prevLocation !== nextLocation) {
            updateScrollValue(false)
        }
    }

    render () {
        const {handleSignOut, scrollValue, updateScrollValue, location: {pathname}} = this.props
        const layout = {handleSignOut, scrollValue, updateScrollValue, pathname}
        const title = 'Rhythm ERP'

        return (
            <DocumentTitle title={title}>
                {React.cloneElement(this.props.children, {layout})}
            </DocumentTitle>
        )
    }
}

export default App
