import _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {setTokenAction, signOutAction, setAuthConfirmAction} from '../../actions/signIn'
import {trackingListFetchAction} from '../../actions/tracking'
import DocumentTitle from 'react-document-title'
import {hashHistory} from 'react-router'
import {compose, withHandlers} from 'recompose'
import {
    notificationGetNotViewed
} from '../../actions/notifications'
import * as ROUTES from '../../constants/routes'

const time = 10000
const refreshAgentsList = 45000
@compose(
    connect(),
    withHandlers({
        handleSignOut: prop => (event) => {
            const {dispatch} = prop
            event.preventDefault()

            dispatch(signOutAction()).then(() => {
                hashHistory.push(ROUTES.SIGN_IN)
            })
        }
    })
)
class App extends React.Component {
    constructor (props) {
        super(props)
        const pathname = _.get(props, ['location', 'pathname'])
        const {dispatch} = props
        dispatch(setTokenAction())
        dispatch(setAuthConfirmAction())
        setInterval(() => {
            dispatch(notificationGetNotViewed())
        }, time)
        if (pathname === '/' + ROUTES.TRACKING) {
            setInterval(() => {
                dispatch(trackingListFetchAction())
            }, refreshAgentsList)
        }

        const mediaQueryList = window.matchMedia('print')
        mediaQueryList.addListener((mql) => {
            if (mql.matches) {
                // Console.log('on before print equivalent')
            } else {
                // Console.log('on after print equivalent')
            }
        })
    }

    render () {
        const {handleSignOut} = this.props
        const layout = {
            handleSignOut
        }
        const title = this.props.title || ''

        return (
            <DocumentTitle title={title}>
                {React.cloneElement(this.props.children, {layout})}
            </DocumentTitle>
        )
    }
}

export default App
