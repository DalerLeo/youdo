import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import {TextField, TimeField} from '../ReduxForm'
import MainStyles from '../Styles/MainStyles'
import toCamelCase from '../../helpers/toCamelCase'

const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    const latLng = (_.get(errors, 'lat') || _.get(errors, 'lon')) && 'Location is required.'

    throw new SubmissionError({
        ...errors,
        latLng,
        _error: nonFieldErrors
    })
}

const colorBlue = '#129fdd !important'
const enhance = compose(
    injectSheet(_.merge(MainStyles, {
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        leftSide: {
            width: '40%',
            paddingRight: '20px',
            height: '100%'
        },
        rightSide: {
            width: '60%',
            borderLeft: '1px solid #efefef',
            padding: '0 0 20px 20px',
            height: '100%'
        },
        innerTitle: {
            marginTop: '20px'
        },
        inputFieldShift: {
            fontSize: '13px !important',
            width: '55% !important',
            marginRight: '20px',
            height: '50px !important',
            '& input': {
                top: '-10px'
            },
            '& label': {
                top: '20px !important'
            }
        },
        inputFieldTime: {
            fontSize: '13px !important',
            width: 'calc(45% - 20px) !important',
            height: '50px !important',
            '& input': {
                top: '-10px'
            },
            '& label': {
                top: '20px !important'
            }
        },
        imageUpload: {
            width: '100px'
        },
        buttonSub: {
            textAlign: 'right',
            marginTop: '10px',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: colorBlue,
                paddingLeft: '10px',
                paddingRight: '10px'
            },
            '& button': {
                margin: '0 !important',
                fontSize: '13px !important',
                marginRight: '-20px !important'
            }
        },
        shift: {
            padding: '20px 0 0',
            '& h4': {
                margin: '0',
                fontSize: '13px',
                fontWeight: '600'
            },
            '& span': {
                marginLeft: '5px',
                color: '#999',
                fontSize: '11px',
                fontWeight: '100'
            },
            '&:hover': {
                '& div:last-child': {
                    display: 'table-cell'
                }
            }
        },
        deleteHideIco: {
            position: 'relative',
            display: 'none',
            float: 'right',
            top: '-15px',
            cursor: 'pointer'
        },
        background: {
            background: '#f1f5f8',
            color: '#333',
            margin: '10px -20px 0 -30px',
            padding: '10px 20px 5px 30px'
        },
        staffAdd: {
            background: '#f1f5f8',
            color: '#333',
            margin: '10px -30px 0 -20px',
            padding: '10px 30px 5px 20px'
        },
        personalList: {
            '& ul': {
                listStyle: 'none',
                margin: '0',
                padding: '0',
                '& li:last-child': {
                    border: 'none'
                }
            },
            '& li': {
                margin: '0',
                borderBottom: '1px dashed #efefef',
                padding: '10px 0',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                '& div:first-child': {
                    width: '30px',
                    height: '30px',
                    display: 'inline-block',
                    borderRadius: '50%',
                    verticalAlign: 'top',
                    marginRight: '10px',
                    overflow: 'hidden'
                },
                '& div:first-child img': {
                    width: '30px'
                },
                '& div:nth-child(2)': {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    width: '80%'
                },
                '& div::nth-child(2) span': {
                    color: '#666'
                },
                '& div:last-child': {
                    top: '0px !important',
                    display: 'none'
                },
                '&:hover': {
                    '& div:last-child': {
                        display: 'flex'
                    }
                }
            }
        }
    })),
    reduxForm({
        form: 'ShiftCreateForm',
        enableReinitialize: true
    })
)

const ManufactureAddStaffDialog = enhance((props) => {
    const {classes, handleSubmit, openAddShift, setOpenAddShift} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate).then(setOpenAddShift(!openAddShift)))

    return (
        <form onSubmit={onSubmit}>
            <Field
                name="name"
                component={TextField}
                className={classes.inputFieldShift}
                label="Наименование"
                fullWidth={true}/>
            <Field
                name="beginTime"
                component={TimeField}
                className={classes.inputFieldTime}
                label="Время"
                fullWidth={true}/>
            <Field
                name="endTime"
                component={TimeField}
                className={classes.inputFieldTime}
                label="Время"
                fullWidth={true}/>
            <div className={classes.buttonSub}>
                <FlatButton
                    label="Сохранить"
                    className={classes.actionButton}
                    type="submit"
                />
            </div>
        </form>
    )
})

ManufactureAddStaffDialog.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    openAddShift: PropTypes.object,
    setOpenAddShift: PropTypes.object
}

ManufactureAddStaffDialog.defaultProps = {
    isUpdate: false
}

export default ManufactureAddStaffDialog
