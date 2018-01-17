import _ from 'lodash'
import React from 'react'
import {compose, withHandlers, withState} from 'recompose'
import injectSheet from 'react-jss'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import t from '../../helpers/translate'
import {TextField, normalizeNumber} from '../ReduxForm'
import {openErrorAction} from '../../actions/error'
import ContentAdd from 'material-ui/svg-icons/content/add-circle-outline'
import ContentRemove from 'material-ui/svg-icons/content/remove-circle-outline'
import IconButton from 'material-ui/IconButton'

const validateForm = values => {
    const errors = {}
    if (values.showClients && values.amount && !values.client) {
        errors.client = 'Клиент не выбран'
    }

    return errors
}

const enhance = compose(
    injectSheet({
        usersLoader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
        },
        salaryWrapper: {
            borderLeft: '1px #efefef solid',
            maxHeight: '600px',
            overflowY: 'auto'
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
        },
        subTitle: {
            margin: '10px 30px',
            fontWeight: '600'
        },
        flex: {
            display: 'flex',
            '& > div': {
                marginRight: '15px',
                width: '185px !important'
            }
        },
        detail: {
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            paddingLeft: '30px',
            paddingRight: '10px'
        }

    }),
    reduxForm({
        form: 'TransactionCreateForm',
        validate: validateForm,
        enableReinitialize: true
    }),
    withState('searchQuery', 'setSearchQuery', ''),
    withHandlers({
        validate: props => (data) => {
            const errors = toCamelCase(data)
            const nonFieldErrors = _.get(errors, 'nonFieldErrors')
            props.dispatch(openErrorAction({
                message: <div>{nonFieldErrors}</div>
            }))
            throw new SubmissionError({
                ...errors,
                _error: nonFieldErrors
            })
        }
    })
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 22,
        height: 22
    },
    button: {
        width: 40,
        height: 40,
        padding: 0,
        display: 'flex',
        justifyContent: 'center'
    }
}

const ONE = 1
const TransactionCreateDetalization = enhance((props) => {
    const {
        fields,
        classes
    } = props

    const handleTouchTap = (index) => {
        const LAST_INDEX = index + ONE

        if (fields.length === LAST_INDEX) {
            return fields.push({})
        }

        return fields.remove(index)
    }

    const details = fields.map((detail, index) => {
        return (
            <div key={index} className={classes.detail}>
                <div>
                    <div className={classes.flex}>
                        <Field
                            label={t('Название')}
                            name={`${detail}.name`}
                            component={TextField}
                            className={classes.inputFieldCustom}/>
                        <Field
                            label={t('Сумма')}
                            name={`${detail}.amount`}
                            component={TextField}
                            normalize={normalizeNumber}
                            className={classes.inputFieldCustom}/>
                    </div>
                </div>
                <IconButton
                    onTouchTap={() => handleTouchTap(index)}
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}>
                    {fields.length !== index + ONE ? <ContentRemove/> : <ContentAdd />}
                </IconButton>
            </div>
        )
    })

    return (
        <div className={classes.salaryWrapper}>
            <div className={classes.subTitle}>{t('Детализация')}</div>
            {_.reverse(details)}
        </div>
    )
})

export default TransactionCreateDetalization
