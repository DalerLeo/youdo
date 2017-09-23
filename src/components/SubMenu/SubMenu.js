import _ from 'lodash'
import React from 'react'
import {Link} from 'react-router'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import HardwareKeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import {MenuItems} from '../SidebarMenu/MenuItems'
import ToolTip from '../ToolTip'

const NOT_FOUND = -1

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'relative',
            width: '100%',
            height: '60px',
            display: 'flex',
            alignItems: 'center'
        },
        transparentWrapper: {
            extend: 'wrapper',
            background: 'rgba(255, 255, 255, 0.7)',
            margin: '0 -28px',
            padding: '0 28px',
            borderBottom: '1px #efefef solid',
            zIndex: '2',
            width: 'auto'
        },
        item: {
            color: '#44637e',
            fontWeight: 'bold',
            marginRight: '25px',
            '&:hover': {
                cursor: 'pointer'
            }
        },
        active: {
            color: '#12aaeb !important',
            extend: 'item',
            borderBottom: '1px solid',
            fontWeight: 'bold'
        },
        subParentIco: {
            display: 'flex',
            paddingRight: '10px',
            paddingLeft: '2px',
            '& svg path': {
                fill: 'rgb(93, 100, 116) !important'
            }
        }
    })
)

const SubMenu = enhance((props) => {
    const {classes, url, opacity} = props

    const parent = _
        .chain(MenuItems)
        .find((item) => {
            return (_.findIndex(item.childs, (ch) => ch.url === url) > NOT_FOUND)
        })
        .value()

    const items = _.map(parent.childs, (item, index) => {
        return (
            <Link to={{pathname: item.url, query: item.query}} key={index}>
                <span className={item.url === url ? classes.active : classes.item}> {item.name}</span>
            </Link>
        )
    })

    return (
        <div className={opacity ? classes.transparentWrapper : classes.wrapper}>
                <ToolTip position="right" text={parent.name}>
                    <div className={classes.subParentIco}>
                        {parent.icon}
                    </div>
                </ToolTip>
            <HardwareKeyboardArrowRight style={{color: '#66696f', height: '12px', marginRight: '15px', width: 'auto'}} />
            {items}
        </div>
    )
})

SubMenu.propTypes = {
    url: PropTypes.string.isRequired
}

export default SubMenu
