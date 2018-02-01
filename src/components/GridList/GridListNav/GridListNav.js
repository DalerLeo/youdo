import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import GridListNavPagination from '../GridListNavPagination'
import GridListNavSearch from '../GridListNavSearch'
import IconButton from 'material-ui/IconButton'
import Check from 'material-ui/svg-icons/av/playlist-add-check'
import HideCheck from 'material-ui/svg-icons/action/visibility-off'
import Uncheck from 'material-ui/svg-icons/toggle/indeterminate-check-box'
import ToolTip from '../../ToolTip'
import {hashHistory} from 'react-router'
import toBoolean from '../../../helpers/toBoolean'
import t from '../../../helpers/translate'
const GridListNav = ({classes, filter, filterDialog, addButton, withoutSearch, checkboxActions, extraButtons, customData, withCheckboxes, withoutPagination}) => {
    const selectIsEmpty = _.isEmpty(filter.getSelects())
    const filterIsEmpty = _.isEmpty(filterDialog)
    const addButtonIsEmpty = _.isEmpty(addButton)
    const listData = _.get(customData, ['listData', 'data'])
    const handleUpdateDialog = _.get(customData, ['dialog', 'handleOpenSetCurrencyDialog'])
    const gridDataId = _.get(customData, 'id')
    const currentCurrency = _.get(_.find(listData, {'id': gridDataId}), 'name')
    const selectCount = filter.getSelects().length
    const showCheckboxes = toBoolean(_.get(filter.getParams(), 'showCheckboxes'))
    const toggleCheckboxes = () => {
        return (!showCheckboxes)
            ? hashHistory.push(filter.createURL({showCheckboxes: 'true'}))
            : hashHistory.push(filter.createURL({showCheckboxes: null, select: null}))
    }
    const clearSelects = () => {
        hashHistory.push(filter.createURL({select: null}))
    }
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
                    <Col xs={3}>
                        {!withoutSearch && <GridListNavSearch filter={filter} filterIsEmpty={filterIsEmpty || addButtonIsEmpty}/>}
                    </Col>
                    <Col xs={6} className={classes.flex}>
                        {!withoutPagination && <GridListNavPagination filter={filter}/>}
                        {withCheckboxes && <ToolTip position="left" text={showCheckboxes ? t('Спрятать флажки') : t('Выбрать из списка')}>
                            <IconButton onTouchTap={toggleCheckboxes}>
                                {showCheckboxes
                                    ? <HideCheck color="#5d6474"/>
                                    : <Check color="#5d6474"/>}
                            </IconButton>
                        </ToolTip>}
                        {extraButtons}
                    </Col>
                </Row>}

                {!selectIsEmpty && <Row className={classes.action}>
                    <Col xs={4}>
                        <div><strong>Выбрано: {selectCount}</strong></div>
                    </Col>
                    <Col xs={8} className={classes.actionButtons}>
                        {!withoutPagination && <GridListNavPagination filter={filter}/>}
                        <div className={classes.buttons}>
                            {checkboxActions}
                            <ToolTip position="left" text={t('Снять выделение')}>
                                <IconButton onTouchTap={clearSelects}>
                                    <Uncheck color="#666"/>
                                </IconButton>
                            </ToolTip>
                        </div>
                    </Col>
                </Row>}
            </div>
        </div>
    )
}

GridListNav.propTypes = {
    filter: PropTypes.object.isRequired,
    checkboxActions: PropTypes.node,
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
        background: '#f2f5f8',
        alignItems: 'center',
        margin: '0 -30px',
        padding: '0 30px',
        '& > div': {
            '&:first-child': {
                paddingLeft: '0'
            },
            '&:last-child': {
                paddingRight: '0'
            }
        }
    },
    actionButtons: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    buttons: {
        extend: 'actionButtons',
        alignItems: 'center',
        marginLeft: '20px'
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
