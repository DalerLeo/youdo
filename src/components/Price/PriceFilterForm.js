import _ from 'lodash'
import React from 'react'
import {compose, withHandlers} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {Link} from 'react-router'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import BorderColorIcon from 'material-ui/svg-icons/editor/border-color'
import {BrandSearchField, MeasurementSearchField} from '../ReduxForm'
import ProductTypeSerachField from '../ReduxForm/Product/ProductTypeSearchField'
import CloseIcon from '../CloseIcon'
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'

export const PRICE_FILTER_OPEN = 'openFilterDialog'

export const PRICE_FILTER_KEY = {
    BRAND: 'brand',
    TYPE: 'type',
    MEASUREMENT: 'measurement'
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
            width: '268px',
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
        form: 'PriceFilterForm',
        enableReinitialize: true
    }),
    withHandlers({
        getCount: props => () => {
            const {filter} = props
            return _(PRICE_FILTER_KEY)
                .values()
                .filter(item => item !== PRICE_FILTER_KEY.FROM_DATE)
                .filter(item => filter.getParam(item))
                .value()
                .length
        }
    })
)

const PriceFilterForm = enhance((props) => {
    const {
        classes,
        filterDialog,
        getCount,
        handleSubmit
    } = props
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
            <div>
                <Link
                    className={classes.arrow}
                    onTouchTap={filterDialog.handleOpenFilterDialog}>
                    <div>Показать фильтр <KeyboardArrowDown color="#12aaeb" /></div>
                </Link>
            </div>
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
                <form onSubmit={handleSubmit(filterDialog.handleSubmitFilterDialog)}>
                    <div>
                        <Field
                            className={classes.inputFieldCustom}
                            name="measurement"
                            component={MeasurementSearchField}
                            label="Мера"/>
                    </div>
                    <div>
                        <Field
                            className={classes.inputFieldCustom}
                            name="brand"
                            component={BrandSearchField}
                            label="Бренд"/>
                        <Field
                            className={classes.inputFieldCustom}
                            name="type"
                            component={ProductTypeSerachField}
                            label="Тип продукта"/>
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

PriceFilterForm.propTypes = {
    filter: PropTypes.object.isRequired,
    filterDialog: PropTypes.shape({
        filterLoading: PropTypes.bool.isRequired,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    })
}

export default PriceFilterForm