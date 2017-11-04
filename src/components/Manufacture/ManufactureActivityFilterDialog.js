import _ from 'lodash'
import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Field, reduxForm} from 'redux-form'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import Close from 'material-ui/svg-icons/action/highlight-off'

export const MANUF_ACTIVITY_FILTER_KEY = {
    SHIFT: 'shift'
}

const enhance = compose(
    injectSheet({
        filterWrapper: {
            opacity: '1',
            zIndex: '50'
        },
        form: {
            position: 'absolute',
            top: '0',
            right: '0',
            width: '300px',
            background: '#fff',
            opacity: '1',
            zIndex: '50'
        },
        closedForm: {
            extend: 'form',
            opacity: '0',
            zIndex: '-999'
        },
        overlay: {
            background: 'rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer',
            zIndex: '49'
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
        }
    }),
    reduxForm({
        form: 'ManufactureActivityFilterForm',
        enableReinitialize: true
    }),
)

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

const ManufactureActivityFilter = enhance((props) => {
    const {classes, filterDialog, handleSubmit} = props
    const isOpen = _.get(filterDialog, 'openFilterDialog')
    return (
        <div className={classes.filterWrapper}>
            {isOpen && <div className={classes.overlay} onClick={filterDialog.handleCloseFilterDialog}>
            </div>}
            <Paper zDepth={2} className={isOpen ? classes.form : classes.closedForm}>
                <form onSubmit={handleSubmit(filterDialog.handleSubmitFilterDialog)}>
                    <div className={classes.filter}>
                        <h3>Фильтр</h3>
                        <IconButton
                            className={classes.closeFilter}
                            style={iconStyle.button}
                            iconStyle={iconStyle.icon}
                            onTouchTap={filterDialog.handleCloseFilterDialog}>
                            <Close/>
                        </IconButton>
                        <FlatButton
                            label="Применить"
                            fullWidth={false}
                            labelStyle={{color: '#12aaeb', textTransform: 'none', fontWeight: '600'}}
                            className={classes.searchButton}
                            type="submit"/>
                    </div>
                </form>
            </Paper>
        </div>
    )
})

export default ManufactureActivityFilter
