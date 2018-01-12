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
import t from '../../helpers/translate'

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

const flatButtonStyle = {
    backgroundColorFilter: '#12aaeb',
    backgroundColorExcel: '#71ce87',
    style: {
        height: '34px',
        lineHeight: '34px',
        overflow: 'unset'
    },
    iconStyle: {
        color: '#fff',
        fill: '#fff',
        width: '18px',
        height: '18px',
        marginBottom: '4px'
    },
    labelStyle: {
        color: '#fff',
        fontWeight: '600',
        verticalAlign: 'baseline',
        textTransform: 'none'
    },
    rippleColor: '#fff'
}

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
        sales
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
                        <h3>{t('Фильтр')}</h3>
                        <IconButton
                            className={classes.closeFilter}
                            style={iconStyle.button}
                            iconStyle={iconStyle.icon}
                            onTouchTap={() => { setOpenFilter(false) }}>
                            <Close />
                        </IconButton>

                        {fields}

                        <FlatButton
                            label={t('Применить')}
                            fullWidth={false}
                            labelStyle={{color: '#12aaeb', textTransform: 'none', fontWeight: '600'}}
                            className={classes.searchButton}
                            type="submit"/>
                    </div>
                </form>
            </Paper>}
            <FlatButton
                label={t('Фильтр') + (filterCount > ZERO ? ' / ' + filterCount : '')}
                onClick={() => { setOpenFilter(true) }}
                style={flatButtonStyle.style}
                backgroundColor={flatButtonStyle.backgroundColorFilter}
                hoverColor={flatButtonStyle.backgroundColorFilter}
                rippleColor={flatButtonStyle.rippleColor}
                labelStyle={flatButtonStyle.labelStyle}
                children={!withoutDate && <span className={classes.date}>{filterDate}</span>}
                icon={<Filter style={flatButtonStyle.iconStyle}/>}/>
            <div className={classes.buttons}>
                {extraButton || null}
                {sales
                    ? <IconMenu
                        menuItemStyle={{fontSize: '13px'}}
                        iconButtonElement={(
                            <FlatButton
                                label={t('Скачать')}
                                style={flatButtonStyle.style}
                                backgroundColor={flatButtonStyle.backgroundColorExcel}
                                hoverColor={flatButtonStyle.backgroundColorExcel}
                                rippleColor={flatButtonStyle.rippleColor}
                                labelStyle={flatButtonStyle.labelStyle}
                                icon={<Excel style={flatButtonStyle.iconStyle}/>}/>
                        )}
                        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem
                            primaryText={t('Накладные')}
                            onTouchTap={() => {
                                handleGetDocument.handleGetDocument()
                            }}/>
                        <MenuItem
                            primaryText={t('Список заказов')}
                            onTouchTap={() => {
                                handleGetDocument.handleGetOrderListDocument()
                            }}/>
                        <MenuItem
                            primaryText={t('Релиз')}
                            onTouchTap={() => {
                                handleGetDocument.handleGetReleaseDocument()
                            }}/>
                    </IconMenu>
                    : <FlatButton
                        label={'Excel'}
                        style={flatButtonStyle.style}
                        onClick={handleGetDocument}
                        backgroundColor={flatButtonStyle.backgroundColorExcel}
                        hoverColor={flatButtonStyle.backgroundColorExcel}
                        rippleColor={flatButtonStyle.rippleColor}
                        labelStyle={flatButtonStyle.labelStyle}
                        icon={<Excel style={flatButtonStyle.iconStyle}/>}/>}
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
    handleGetDocument: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ])
}

export default StatisticsFilterExcel
