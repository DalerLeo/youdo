import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import GridListNavPagination from '../GridListNavPagination'
import GridListNavSearch from '../GridListNavSearch'

const GridListNav = ({classes, filter, filterDialog, actions}) => {
    const selectIsEmpty = _.isEmpty(filter.getSelects())

    return (
        <div className={classes.wrapper}>
            {selectIsEmpty && <Row>
                <Col xs={4}>
                    {filterDialog}
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
    filter: PropTypes.object.isRequired,
    actions: PropTypes.node.isRequired
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
    action: {
        background: '#ccc !important'
    },
    actionButtons: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
})(GridListNav)
