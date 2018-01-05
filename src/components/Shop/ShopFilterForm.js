import _ from 'lodash'
import React from 'react'
import {compose, withHandlers} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {Link} from 'react-router'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import BorderColorIcon from 'material-ui/svg-icons/editor/border-color'
import {
    ClientMultiSearchField,
    ShopStatusSearchField,
    FrequencySearchField,
    UsersMultiSearchField,
    ZoneMultiSearchField,
    MarketTypeParentSearchField,
    MarketTypeSearchField,
    CheckBox} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/action/highlight-off'
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import t from '../../helpers/translate'

export const SHOP_FILTER_OPEN = 'openFilterDialog'

export const SHOP_FILTER_KEY = {
    CLIENT: 'client',
    MARKET_TYPE: 'marketType',
    MARKET_TYPE_PARENT: 'marketTypeParent',
    STATUS: 'isActive',
    FREQUENCY: 'frequency',
    ZONE: 'zone',
    CREATED_BY: 'createdBy',
    NULL_BORDER: 'nullBorder'
}

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'absolute',
            width: '310px',
            background: '#fff',
            zIndex: 99,
            top: 0,
            left: 0,
            borderRadius: 0,
            padding: '10px 20px 10px 20px'
        },
        afterFilter: {
            alignItems: 'center',
            display: 'flex',
            backgroundColor: '#efefef',
            position: 'relative',
            padding: '16px 30px',
            marginLeft: '-30px',
            '& > div:nth-child(2)': {
                position: 'absolute',
                right: '0'
            },
            '& > div:nth-child(1)': {
                color: '#666666'
            },
            '& button': {
                borderLeft: '1px solid white !important'
            }
        },
        icon: {
            color: '#8f8f8f !important'
        },
        arrow: {
            color: '#12aaeb',
            paddingRight: '14px',
            position: 'relative',
            '& svg': {
                position: 'absolute',
                width: '13px !important',
                height: '20px !important'
            }
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            '& button': {
                marginRight: '-12px !important'
            }
        },
        title: {
            fontSize: '15px',
            color: '#5d6474'
        },
        submit: {
            color: '#fff !important'
        },
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
        }
    }),
    reduxForm({
        form: 'ShopFilterForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const typeParent = _.get(state, ['form', 'ShopFilterForm', 'values', 'marketTypeParent', 'value'])
        return {
            typeParent
        }
    }),
    withHandlers({
        getCount: props => () => {
            const {filter} = props
            return _(SHOP_FILTER_KEY)
                .values()
                .filter(item => item !== SHOP_FILTER_KEY.FROM_DATE)
                .filter(item => filter.getParam(item))
                .value()
                .length
        }
    })
)

const ShopFilterForm = enhance((props) => {
    const {classes, filterDialog, getCount, handleSubmit, typeParent} = props
    const filterCounts = getCount()

    if (!filterDialog.openFilterDialog) {
        if (filterCounts) {
            return (
                <div className={classes.afterFilter}>
                    <div>{t('Фильтр')}: {filterCounts} {t('элемента')}</div>
                    <div>
                        <IconButton onTouchTap={filterDialog.handleOpenFilterDialog}>
                            <BorderColorIcon color="#8f8f8f" />
                        </IconButton>
                        <IconButton onTouchTap={filterDialog.handleClearFilterDialog}>
                            <CloseIcon className={classes.icon}/>
                        </IconButton>
                    </div>
                </div>
            )
        }

        return (
            <div>
                <Link
                    className={classes.arrow}
                    onTouchTap={filterDialog.handleOpenFilterDialog}>
                    <div>{t('Показать фильтр')} <KeyboardArrowDown color="#12aaeb" /></div>
                </Link>
            </div>
        )
    }

    return (
        <div>
            <Paper className={classes.wrapper} zDepth={2}>
                <div className={classes.header}>
                    <span className={classes.title}>{t('Фильтр')}</span>
                    <IconButton onTouchTap={filterDialog.handleCloseFilterDialog}>
                        <CloseIcon className={classes.icon} />
                    </IconButton>
                </div>
                <form onSubmit={handleSubmit(filterDialog.handleSubmitFilterDialog)}>
                    <Field
                        className={classes.inputFieldCustom}
                        name="marketTypeParent"
                        component={MarketTypeParentSearchField}
                        label={t('Тип магазина')}
                        fullWidth={true}/>
                    {typeParent
                    ? <Field
                        className={classes.inputFieldCustom}
                        name="marketType"
                        component={MarketTypeSearchField}
                        label={t('Подкатегория')}
                        parentType={typeParent}
                        fullWidth={true}/>
                    : null}
                    <Field
                        className={classes.inputFieldCustom}
                        name="isActive"
                        component={ShopStatusSearchField}
                        label={t('Статус')}
                        fullWidth={true}/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="createdBy"
                        component={UsersMultiSearchField}
                        label={t('Создал')}/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="client"
                        component={ClientMultiSearchField}
                        label={t('Клиент')}/>
                    <Field className={classes.inputFieldCustom}
                           name="zone"
                           component={ZoneMultiSearchField}
                           label={t('Зона')}/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="frequency"
                        component={FrequencySearchField}
                        label={t('Частота посещений')}/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="nullBorder"
                        component={CheckBox}
                        label={t('Зона не определена')}/>

                    <RaisedButton
                        type="submit"
                        primary={true}
                        buttonStyle={{color: '#fff'}}
                        label={t('Применить')}
                        labelStyle={{fontSize: '13px'}}
                        style={{marginTop: '15px'}}>
                    </RaisedButton>
                </form>
            </Paper>
        </div>
    )
})

ShopFilterForm.propTypes = {
    filter: PropTypes.object.isRequired,
    filterDialog: PropTypes.shape({
        filterLoading: PropTypes.bool.isRequired,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    })
}

export default ShopFilterForm
