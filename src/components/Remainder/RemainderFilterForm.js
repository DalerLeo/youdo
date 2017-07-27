import React from 'react'
import _ from 'lodash'
import {compose, withHandlers} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import injectSheet from 'react-jss'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import PropTypes from 'prop-types'
import StockSearchField from '../ReduxForm/Stock/StockSearchField'
import ProductTypeSearchField from '../ReduxForm/Product/ProductTypeSearchField'
import RemainderStatusSearchField from '../ReduxForm/Remainder/RemainderStatusSearchField'
import BorderColorIcon from 'material-ui/svg-icons/editor/border-color'
import {Link} from 'react-router'
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import CloseIcon from '../CloseIcon'
export const REMAINDER_FILTER_OPEN = 'openFilterDialog'

export const REMAINDER_FILTER_KEY = {
    TYPE: 'type',
    STOCK: 'stock',
    STATUS: 'status'
}

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'absolute',
            minWidth: '300px',
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
            position: 'absolute',
            padding: '0 30px',
            height: '48px',
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
            display: 'flex',
            alignItems: 'center',
            color: '#12aaeb',
            paddingRight: '14px',
            position: 'relative',
            '& svg': {
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
        form: 'RemainderFilterForm',
        enableReinitialize: true
    }),
    withHandlers({
        getCount: props => () => {
            const {filter} = props
            return _(REMAINDER_FILTER_KEY)
                .values()
                .filter(item => item !== REMAINDER_FILTER_KEY.FROM_DATE)
                .filter(item => filter.getParam(item))
                .value()
                .length
        }
    })
)

const RemainderFilterForm = enhance((props) => {
    const {classes, filterDialog, getCount} = props
    const filterCounts = getCount()

    if (!filterDialog.openFilterDialog) {
        if (filterCounts) {
            return (
                    <div className={classes.afterFilter}>
                        <div>Фильтр: {filterCounts} элемента</div>
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
                <Link
                    className={classes.arrow}
                    onTouchTap={filterDialog.handleOpenFilterDialog}>
                    <div>Показать фильтр</div> <KeyboardArrowDown color="#12aaeb" />
                </Link>
        )
    }
    return (
        <div>
            <Paper className={classes.wrapper} zDepth={2}>
                <div className={classes.header}>
                    <span className={classes.title}>Фильтр</span>
                    <IconButton onTouchTap={filterDialog.handleCloseFilterDialog}>
                        <CloseIcon className={classes.icon} />
                    </IconButton>
                </div>
                <form onSubmit={filterDialog.handleSubmitFilterDialog}>
                    <div>
                        <Field
                            className={classes.inputFieldCustom}
                            name="stock"
                            component={StockSearchField}
                            label="Склад"
                            fullWidth={true}/>
                        <Field
                            className={classes.inputFieldCustom}
                            name="type"
                            component={ProductTypeSearchField}
                            fullWidth={true}
                            label="Тип товара"/>
                        <Field
                            className={classes.inputFieldCustom}
                            name="status"
                            fullWidth={true}
                            component={RemainderStatusSearchField}
                            label="Статус"/>
                    </div>

                    <RaisedButton
                        type="submit"
                        primary={true}
                        buttonStyle={{color: '#fff'}}
                        label="Применить"
                        style={{marginTop: '15px'}}>
                    </RaisedButton>
                </form>
            </Paper>
        </div>
    )
})

RemainderFilterForm.propTypes = {
    filterDialog: PropTypes.shape({
        openFilterDialog: PropTypes.bool.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired,
        handleClearFilterDialog: PropTypes.func.isRequired
    }).isRequired
}

export default RemainderFilterForm
