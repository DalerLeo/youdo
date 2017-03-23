import React from 'react'
import {connect} from 'react-redux'
import {setTokenAction, signOutAction} from '../../actions/signIn'
import DocumentTitle from 'react-document-title'
import {hashHistory} from 'react-router'
import {compose, withHandlers} from 'recompose'
import * as ROUTES from '../../constants/routes'

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

        const {dispatch} = props
        dispatch(setTokenAction())
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
