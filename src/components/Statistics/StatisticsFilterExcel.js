import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import {reduxForm} from 'redux-form'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Filter from 'material-ui/svg-icons/content/filter-list'
import Close from 'material-ui/svg-icons/action/highlight-off'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import moment from 'moment'
import MenuItem from 'material-ui/MenuItem'
import IconMenu from 'material-ui/IconMenu'
const ZERO = 0

const enhance = compose(
    injectSheet({
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        filterWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
        },
        form: {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '300px',
            background: '#fff',
            zIndex: '50'
        },
        overlay: {
            background: 'rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '49',
            cursor: 'pointer'
        },
        filter: {
            display: 'flex',
            width: '100%',
            padding: '20px 30px',
            flexDirection: 'column',
            position: 'relative',
            '& h3': {
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '20px'
            }
        },
        closeFilter: {
            position: 'absolute !important',
            top: 10,
            right: 10
        },
        searchButton: {
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        excel: {
            background: '#71ce87',
            borderRadius: '2px',
            color: '#fff',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            padding: '5px 15px',
            '& svg': {
                width: '18px !important'
            }
        },
        filterBtn: {
            extend: 'excel',
            background: '#12aaeb',
            position: 'relative'
        },
        count: {
            marginLeft: '5px'
        },
        date: {
            extend: 'excel',
            background: 'transparent',
            height: '100%',
            padding: '0 10px',
            justifyContent: 'center',
            position: 'absolute',
            left: '100%',
            color: '#12aaeb',
            whiteSpace: 'nowrap'
        },
        buttons: {
            display: 'flex',
            alignItems: 'center'
        }
    }),
    reduxForm({
        form: 'StatisticsFilterForm',
        enableReinitialize: true
    }),
    withState('openFilter', 'setOpenFilter', false),
)

const StatisticsFilterExcel = enhance((props) => {
    const {
        filter,
        classes,
        filterKeys,
        fields,
        handleSubmitFilterDialog,
        setOpenFilter,
        openFilter,
        handleGetDocument,
        withoutDate,
        extraButton,
        sales,
        handleOpenprintDialog
    } = props

    const iconStyle = {
        button: {
            width: 44,
            height: 44,
            padding: 11
        },
        icon: {
            width: 22,
            height: 22,
            color: '#666'
        }
    }
    const getFilterCount = () => {
        return _(filterKeys)
            .values()
            .filter(item => item !== filterKeys.FROM_DATE && item !== filterKeys.SEARCH)
            .filter(item => filter.getParam(item))
            .value()
            .length
    }
    const filterCount = getFilterCount()
    const filterDate = !_.isNil(_.get(filter.getParams(), 'fromDate') || _.get(filter.getParams(), 'fromDate'))
        ? moment(_.get(filter.getParams(), 'fromDate')).format('DD.MM.YYYY') + ' - ' + moment(_.get(filter.getParams(), 'toDate')).format('DD.MM.YYYY')
        : moment(_.get(props, ['initialValues', 'date', 'fromDate'])).format('DD.MM.YYYY') + ' - ' + moment(_.get(props, ['initialValues', 'date', 'toDate'])).format('DD.MM.YYYY')
    return (
        <div className={classes.filterWrapper}>
            {openFilter && <div
                className={classes.overlay}
                onClick={() => { setOpenFilter(false) }}> </div>}
            {openFilter && <Paper zDepth={2} className={classes.form}>
                <form onSubmit={() => {
                    handleSubmitFilterDialog()
                    setOpenFilter(false)
                }}>
                    <div className={classes.filter}>
                        <h3>Фильтр</h3>
                        <IconButton
                            className={classes.closeFilter}
                            style={iconStyle.button}
                            iconStyle={iconStyle.icon}
                            onTouchTap={() => { setOpenFilter(false) }}>
                            <Close />
                        </IconButton>

                        {fields}

                        <FlatButton
                            label="Применить"
                            fullWidth={false}
                            labelStyle={{color: '#12aaeb', textTransform: 'none', fontWeight: '600'}}
                            className={classes.searchButton}
                            type="submit"/>
                    </div>
                </form>
            </Paper>}
            <a className={classes.filterBtn} onClick={() => { setOpenFilter(true) }}>
                <Filter color="#fff"/> <span>Фильтр</span>
                {filterCount > ZERO && <span className={classes.count}>/ {filterCount}</span>}
                {!withoutDate && <span className={classes.date}>{filterDate}</span>}
            </a>
            <div className={classes.buttons}>
                {extraButton || null}
                {sales ? <IconMenu
                    menuItemStyle={{fontSize: '13px'}}
                    iconButtonElement={<a className={classes.excel}>
                                            <Excel color="#fff"/> <span>Скачать</span>
                                        </a>
                    }
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem
                        primaryText="Накладные"
                        onTouchTap={handleOpenprintDialog}
                    />
                    <MenuItem
                        primaryText="Список заказов"
                        onTouchTap={() => { handleGetDocument() }}
                    />
                    <MenuItem
                        primaryText="Релиз"
                        onTouchTap={() => { handleGetDocument() }}
                    />
                </IconMenu>
                    : <a className={classes.excel} onClick={handleGetDocument}>
                        <Excel color="#fff"/> <span>Excel</span>
                      </a>}

            </div>
        </div>
    )
})

StatisticsFilterExcel.propTypes = {
    filter: PropTypes.object.isRequired,
    filterKeys: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    fields: PropTypes.node.isRequired,
    handleSubmitFilterDialog: PropTypes.func.isRequired,
    handleGetDocument: PropTypes.func.isRequired,
    setOpenFilter: PropTypes.func.isRequired
}

export default StatisticsFilterExcel
