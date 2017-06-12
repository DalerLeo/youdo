import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import GridListNavPagination from '../GridListNavPagination'
import GridListNavSearch from '../GridListNavSearch'

const GridListNav = ({classes, filter, filterDialog, actions, withoutSearch, customData}) => {
    const selectIsEmpty = _.isEmpty(filter.getSelects())
    const filterIsEmpty = _.isEmpty(filterDialog)
    const listData = _.get(customData, ['listData', 'data'])
    const handleUpdateDialog = _.get(customData, ['dialog', 'handleOpenSetCurrencyDialog'])
    const gridDataId = _.get(customData, 'id')
    const currentCurrency =  _.get(_.find(listData, {'id': gridDataId}), 'name')
    return (
        <div className={classes.wrapper}>
            <div style={{padding: '0 30px'}}>
                {(selectIsEmpty && filterIsEmpty) && <Row>
                    <Col xs={6} style={{display: 'flex', alignItems: 'center'}}>
                        {!withoutSearch && <GridListNavSearch filter={filter} filterIsEmpty={filterIsEmpty}/>}
                        {withoutSearch &&
                        <div className={classes.currencyName}>
                            <span>{currentCurrency}</span>
                            <a onClick={() => {
                                handleUpdateDialog(gridDataId)
                            }} className={classes.link}>Установить курс</a>
                        </div>}
                    </Col>
                    <Col xs={6}>
                        <GridListNavPagination filter={filter}/>
                    </Col>
                </Row>}

                {(selectIsEmpty && !filterIsEmpty) && <Row>
                    <Col xs={4}>
                        {filterDialog}
                    </Col>
                    <Col xs={4}>
                        {!withoutSearch && <GridListNavSearch filter={filter} filterIsEmpty={filterIsEmpty}/>}
                    </Col>
                    <Col xs={4}>
                        <GridListNavPagination filter={filter}/>
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
        </div>
    )
}

GridListNav.propTypes = {
    filter: PropTypes.object.isRequired,
    actions: PropTypes.node.isRequired,
    withoutSearch: PropTypes.bool.isRequired,
    customData: PropTypes.shape({
        dialog: PropTypes.node.isRequired,
        listData: PropTypes.array.isRequired
    }),
    setCurrencyUpdateDialog: PropTypes.shape({
        setCurrencyLoading: PropTypes.bool.isRequired,
        openSetCurrencyDialog: PropTypes.bool.isRequired,
        handleOpenSetCurrencyDialog: PropTypes.func.isRequired,
        handleCloseSetCurrencyDialog: PropTypes.func.isRequired,
        handleSubmitSetCurrencyDialog: PropTypes.func.isRequired
    })
}

export default injectSheet({
    wrapper: {
        '& .row': {
            height: '100%'
        },
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
    currencyName: {
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    link: {
        color: '#12aaeb !important',
        fontWeight: '600 !important'
    },
    action: {
        background: '#ccc !important'
    },
    actionButtons: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
})(GridListNav)
