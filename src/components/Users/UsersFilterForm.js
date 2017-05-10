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
import {CategorySearchField} from '../ReduxForm'
import CloseIcon from '../CloseIcon'
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'

export const USERS_FILTER_OPEN = 'openFilterDialog'

export const USERS_FILTER_KEY = {
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
            width: '268px',
            alignItems: 'center',
            display: 'flex',
            backgroundColor: '#efefef',
            position: 'relative',
            padding: '16px',
            marginLeft: '-13px',
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
        inputField: {
            fontSize: '13px !important'
        }
    }),
    reduxForm({
        form: 'UsersFilterForm',
        enableReinitialize: true
    }),
    withHandlers({
        getCount: props => () => {
            const {filter} = props
            return _(USERS_FILTER_KEY)
                .values()
                .filter(item => item !== USERS_FILTER_KEY.FROM_DATE)
                .filter(item => filter.getParam(item))
                .value()
                .length
        }
    })
)

const UsersFilterForm = enhance((props) => {
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
                <form onSubmit={filterDialog.handleSubmitFilterDialog}>
                    <div>
                        <Field className={classes.inputField} name="category" component={CategorySearchField} label="Категория"/>
                    </div>

                    <div>
                        <Field className={classes.inputField} name="date" component={DateToDateField} label="Диапазон дат" fullWidth={true}/>
                    </div>

                    <div>
                        <RaisedButton
                            type="submit"
                            primary={true}
                            buttonStyle={{color: '#fff'}}>
                            Применить
                        </RaisedButton>
                    </div>
                </form>
            </Paper>
        </div>
    )
})

UsersFilterForm.propTypes = {
    filter: PropTypes.object.isRequired,
    filterDialog: PropTypes.shape({
        filterLoading: PropTypes.bool.isRequired,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    })
}

export default UsersFilterForm