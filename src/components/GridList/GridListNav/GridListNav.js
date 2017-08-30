import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import GridListNavPagination from '../GridListNavPagination'
import GridListNavSearch from '../GridListNavSearch'
import IconButton from 'material-ui/IconButton'
import Print from 'material-ui/svg-icons/action/print'
import RefreshIcon from 'material-ui/svg-icons/action/cached'
import Tooltip from '../../ToolTip'

const GridListNav = ({classes, filter, filterDialog, addButton, actions, withoutSearch, customData, withInvoice, printDialog, refreshAction, withoutPagination}) => {
    const selectIsEmpty = _.isEmpty(filter.getSelects())
    const filterIsEmpty = _.isEmpty(filterDialog)
    const addButtonIsEmpty = _.isEmpty(addButton)
    const listData = _.get(customData, ['listData', 'data'])
    const handleUpdateDialog = _.get(customData, ['dialog', 'handleOpenSetCurrencyDialog'])
    const gridDataId = _.get(customData, 'id')
    const currentCurrency = _.get(_.find(listData, {'id': gridDataId}), 'name')
    const listCount = filter.getCounts()
    const MAX_COUNT = 300
    return (
        <div className={classes.wrapper}>
            <div style={{padding: '0 30px'}}>
                {(selectIsEmpty && filterIsEmpty && addButtonIsEmpty) && <Row>
                    <Col xs={6} style={withoutPagination ? {} : {display: 'flex', alignItems: 'center'}}>
                        {!withoutSearch && <GridListNavSearch filter={filter} filterIsEmpty={filterIsEmpty || addButtonIsEmpty}/>}
                        {withoutSearch &&
                        <div className={classes.currencyName}>
                            <span>{currentCurrency}</span>
                            <a onClick={() => {
                                handleUpdateDialog(gridDataId)
                            }} className={classes.link}>Установить курс</a>
                        </div>}
                    </Col>
                    {!withoutPagination && <Col xs={6}>
                         <GridListNavPagination filter={filter}/>
                    </Col>}
                </Row>}

                {(selectIsEmpty && (!filterIsEmpty || !addButtonIsEmpty)) && <Row>
                    <Col xs={3}>
                        {filterIsEmpty ? addButton : filterDialog}
                    </Col>
                    <Col xs={4}>
                        {!withoutSearch && <GridListNavSearch filter={filter} filterIsEmpty={filterIsEmpty || addButtonIsEmpty}/>}
                    </Col>
                    <Col xs={5} className={classes.flex}>
                        {!withoutPagination && <GridListNavPagination filter={filter}/>}
                        {withInvoice &&
                        <Tooltip position="left" text={(listCount > MAX_COUNT) ? 'Превышено количество данных' : 'Распечатать накладные'}>
                            <IconButton
                                disabled={(listCount > MAX_COUNT) && true}
                                onTouchTap={printDialog.handleOpenPrintDialog}>
                                <Print color="#666"/>
                            </IconButton>
                        </Tooltip>}
                        {refreshAction &&
                        <Tooltip position="left" text={'Обновить'}>
                            <IconButton
                                disabled={false}
                                onTouchTap={refreshAction}>
                                <RefreshIcon color="#666"/>
                            </IconButton>
                        </Tooltip>}
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
    actions: PropTypes.node,
    withoutSearch: PropTypes.bool.isRequired,
    withoutPagination: PropTypes.bool,
    withInvoice: PropTypes.bool,
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
    }),
    printDialog: PropTypes.shape({
        openPrint: PropTypes.bool,
        handleOpenPrintDialog: PropTypes.func,
        handleClosePrintDialog: PropTypes.func
    }),
    refreshAction: PropTypes.func
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
            marginBottom: '50px'
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
    },
    flex: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        '& > div:nth-child(2)': {
            marginLeft: '20px'
        }
    }
})(GridListNav)
