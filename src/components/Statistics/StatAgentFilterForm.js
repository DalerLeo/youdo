import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import PropTypes from 'prop-types'
import {reduxForm, Field} from 'redux-form'
import {TextField} from '../ReduxForm'
import DateToDateField from '../ReduxForm/Basic/DateToDateField'
import ZoneSearchField from '../ReduxForm/ZoneSearchField'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import Excel from 'material-ui/svg-icons/av/equalizer'

export const STAT_AGENT_FILTER_KEY = {
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    ZONE: 'zone',
    DIVISION: 'division',
    SEARCH: 'search'
}

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
        form: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        filter: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                width: '170px!important',
                position: 'relative',
                marginRight: '40px',
                '&:last-child': {
                    margin: '0'
                },
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    right: '-20px',
                    height: '30px',
                    width: '1px',
                    top: '50%',
                    marginTop: '-15px',
                    background: '#efefef'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        },
        searchButton: {
            marginLeft: '-10px !important',
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
        }

    }),
    reduxForm({
        form: 'StatAgentFilterForm',
        enableReinitialize: true
    }),
)

const StatAgentFilterForm = enhance((props) => {
    const {
        classes,
        onSubmit,
        getDocument
    } = props
    const iconStyle = {
        icon: {
            color: '#5d6474',
            width: 22,
            height: 22
        },
        button: {
            width: 40,
            height: 40,
            padding: 0
        }
    }

    return (
        <form className={classes.form} onSubmit={onSubmit}>
            <div className={classes.filter}>
                <Field
                    className={classes.inputFieldCustom}
                    name="date"
                    component={DateToDateField}
                    label="Диапазон дат"
                    fullWidth={true}/>
                <Field
                    className={classes.inputFieldCustom}
                    name="zone"
                    component={ZoneSearchField}
                    label="Зона"
                    fullWidth={true}/>
                <Field
                    className={classes.inputFieldCustom}
                    name="search"
                    component={TextField}
                    label="Поиск"
                    fullWidth={true}/>
                <IconButton
                    className={classes.searchButton}
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}
                    type="submit">
                    <Search/>
                </IconButton>
            </div>
            <a className={classes.excel}
               onClick={getDocument.handleGetDocument}>
                <Excel color="#fff"/> <span>Excel</span>
            </a>
        </form>
    )
})

StatAgentFilterForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    getDocument: PropTypes.func.isRequired
}

export default StatAgentFilterForm
