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
import DateToDateField from '../ReduxForm/DateToDateField'
import CategorySearchField from '../CategorySearchField'
import CloseIcon from '../CloseIcon'

export const SHOP_FILTER_OPEN = 'openFilterDialog'

export const SHOP_FILTER_KEY = {
    CATEGORY: 'category',
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate'
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
            display: 'flex',
            alignItems: 'center'
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
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        title: {
            fontSize: '15px',
            color: '#5d6474'
        },
        submit: {
            color: '#fff !important'
        }
    }),
    reduxForm({
        form: 'ShopFilterForm',
        enableReinitialize: true
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
    const {classes, filterDialog, getCount} = props
    const filterCounts = getCount()

    if (!filterDialog.openFilterDialog) {
        if (filterCounts) {
            return (
                <div className={classes.afterFilter}>
                    <div>Filter counts: {filterCounts}</div>

                    <IconButton onTouchTap={filterDialog.handleOpenFilterDialog}>
                        <BorderColorIcon />
                    </IconButton>

                    <IconButton onTouchTap={filterDialog.handleClearFilterDialog}>
                        <CloseIcon />
                    </IconButton>
                </div>
            )
        }

        return (
            <div>
                <Link
                    className={classes.arrow}
                    onTouchTap={filterDialog.handleOpenFilterDialog}>
                    Show filter
                </Link>
            </div>
        )
    }

    return (
        <div>
            <Paper className={classes.wrapper} zDepth={2}>
                <div className={classes.header}>
                    <span className={classes.title}>Filter</span>
                    <IconButton onTouchTap={filterDialog.handleCloseFilterDialog}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <form onSubmit={filterDialog.handleSubmitFilterDialog}>
                    <div>
                        <Field name="category" component={CategorySearchField} label="Category" />
                    </div>

                    <div>
                        <Field name="date" component={DateToDateField} label="Date to Date" fullWidth={true} />
                    </div>

                    <div>
                        <RaisedButton
                            type="submit"
                            primary={true}
                            buttonStyle={{color: '#fff'}}>
                            Apply
                        </RaisedButton>
                    </div>
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
