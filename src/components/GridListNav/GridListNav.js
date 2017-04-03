import _ from 'lodash'
import React from 'react'
import {Link} from 'react-router'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import GridListNavPagination from '../GridListNavPagination'
import GridListNavSearch from '../GridListNavSearch'
import toBoolean from '../../helpers/toBoolean'

const GridListNav = ({classes, filter, filterDialog, actions}) => {
    const selectIsEmpty = _.isEmpty(filter.getSelects())
    const showFilterUrl = filter.createURL({filter: 'true'})
    const showFilter = toBoolean(filter.getParam('filter'))

    return (
        <div className={classes.wrapper}>
            {selectIsEmpty && <Row>
                <Col xs={4}>
                    {showFilter && filterDialog}
                    <Link to={showFilterUrl} className={classes.arrow}>Show filter</Link>
                </Col>
                <Col xs={4}>
                    <GridListNavSearch filter={filter} />
                </Col>
                <Col xs={4}>
                    <GridListNavPagination filter={filter} />
                </Col>
            </Row>}

            {!selectIsEmpty && <Row className={classes.action}>
                <Col xs={1}>
                    {filter.getSelects().length} selected
                </Col>
                <Col xs={11} className={classes.actionButtons}>
                    {actions}
                </Col>
            </Row>}
        </div>
    )
}

GridListNav.propTypes = {
    filter: React.PropTypes.object.isRequired,
    actions: React.PropTypes.node.isRequired
}

export default injectSheet({
    wrapper: {
        '& > div': {
            marginLeft: '0 !important',
            marginRight: '0 !important',
            height: '50px',
            background: '#fff',
            alignItems: 'center',
            padding: '0 5px',
            marginBottom: '50px',
            boxShadow: 'rgba(0, 0, 0, 0.156863) 0px 3px 10px, rgba(0, 0, 0, 0.227451) 0px 3px 10px'
        }
    },
    arrow: {
        paddingRight: '14px',
        position: 'relative',
        '&::after': {
            position: 'absolute',
            top: '8px',
            right: 0,
            content: '""',
            borderTop: '5px solid',
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent'
        }
    },
    action: {
        background: '#ccc !important'
    },
    actionButtons: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
})(GridListNav)
