import React from 'react'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {Link} from 'react-router'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import ClearIcon from 'material-ui/svg-icons/navigation/close'
import DateToDateField from '../ReduxForm/DateToDateField'
import CategorySearchField from '../CategorySearchField'
import CloseIcon from '../CloseIcon'

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
    })
)

const ShopFilterForm = enhance((props) => {
    const {classes, filterDialog} = props

    if (!filterDialog.openFilterDialog) {
        return (
            <div>
                <Link
                    className={classes.arrow}
                    onTouchTap={filterDialog.handleOpenFilterDialog}>
                    Show filter
                </Link>

                <IconButton onTouchTap={filterDialog.handleClearFilterDialog}>
                    <ClearIcon />
                </IconButton>
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
    filterDialog: PropTypes.shape({
        filterLoading: PropTypes.bool.isRequired,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    })
}

export default ShopFilterForm
