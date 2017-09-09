import React from 'react'
import _ from 'lodash'
import Badge from 'material-ui/Badge'
import ToolTip from '../ToolTip'
import FlatButton from 'material-ui/FlatButton'
import Notification from 'material-ui/svg-icons/social/notifications'
import axios from '../../helpers/axios'

const ZERO = 0
const TIMER = 1800000

export default class CustomBadge extends React.Component {
    constructor (props) {
        super(props)
        this.state = {count: 0}
    }

    componentDidMount () {
        setInterval(
            () => this.setCount(),
            TIMER
        )
    }

    setCount () {
        axios()
            .get('notification/notifications/get_not_viewed')
            .then((response) => {
                this.setState({
                    count: _.get(response, ['data', 'count'])
                })
            })
    }

    render () {
        const {classBadge, style, handleOpen} = this.props
        if (this.state.count <= ZERO) {
            return (
                <ToolTip position="right" text="Уведомления">
                    <FlatButton
                        rippleColor="#fff"
                        style={style}
                        onTouchTap={() => {
                            handleOpen(true)
                        }}>
                        <Notification />
                    </FlatButton>
                </ToolTip>
            )
        }
        return (
            <Badge
                className={classBadge}
                badgeContent={this.state.count}
                badgeStyle={{top: 8, right: 10}}>
                <ToolTip position="right" text="Уведомления">
                    <FlatButton
                        rippleColor="#fff"
                        style={style}
                        onTouchTap={() => {
                            handleOpen(true)
                        }}>
                        <Notification />
                    </FlatButton>
                </ToolTip>
            </Badge>
        )
    }
}
