import React from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import * as ROUTES from '../../constants/routes'
import {setTokenAction, signOutAction, setAuthConfirmAction} from '../../actions/signIn'
import {hashHistory} from 'react-router'

import {
    compose,
    withState,
    withHandlers
} from 'recompose'

const enhance = compose(
    connect(),
    withHandlers({
        handleSignOut: prop => (event) => {
            const {dispatch} = prop
            event.preventDefault()

            dispatch(signOutAction())
                .then(() => {
                    hashHistory.push(ROUTES.SIGN_IN)
                })
        }
    }),
    withState('scrollValue', 'updateScrollValue', false)

)

class AppLayout extends React.Component {
    constructor (props) {
        super(props)
        const {dispatch} = props
        dispatch(setTokenAction())
        dispatch(setAuthConfirmAction())
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
        return (
            React.cloneElement(this.props.children, {layout})
        )
    }
}

export default enhance(AppLayout)
