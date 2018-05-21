import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import t from '../../../helpers/translate'
import FlatButton from 'material-ui/FlatButton'
import {TextField} from '../../ReduxForm'
import {
    BORDER_STYLE,
    COLOR_RED,
    LINK_COLOR
} from '../../../constants/styleConstants'

const enhance = compose(
    injectSheet({
        wrapper: {
            marginTop: '20px'
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
            fontWeight: '600'
        },
        flex: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                marginRight: '10px'
            }
        },
        detail: {
            borderBottom: BORDER_STYLE,
            margin: '0 -30px',
            padding: '10px 30px',
            '&:last-child': {
                borderBottom: 'none'
            }
        },
        addAnother: {
            width: '100%',
            marginTop: '5px'
        }
    })
)

const buttonStyle = {
    remove: {
        color: COLOR_RED,
        fontWeight: '600',
        textTransform: 'none',
        verticalAlign: 'baseline'
    },
    label: {
        color: LINK_COLOR,
        fontWeight: '600',
        textTransform: 'none',
        verticalAlign: 'baseline'
    }
}

const CompanyContactsField = enhance((props) => {
    const {fields, classes} = props

    const handleTouchTap = (index, addAnother) => {
        if (addAnother) {
            return fields.push({})
        }
        return fields.remove(index)
    }

    const details = fields.map((detail, index) => {
        return (
            <div key={index} className={classes.detail}>
                <div className={classes.flex}>
                    <Field
                        label={t('Имя')}
                        name={`${detail}.firstName`}
                        component={TextField}
                        className={classes.inputFieldCustom}/>
                    <Field
                        label={t('Фамилия')}
                        name={`${detail}.secondName`}
                        component={TextField}
                        className={classes.inputFieldCustom}/>
                </div>
                <Field
                    label={t('Номер телефона')}
                    name={`${detail}.phone`}
                    component={TextField}
                    className={classes.inputFieldCustom}
                    fullWidth/>
                <FlatButton
                    label={t('Удалить контакт')}
                    labelStyle={buttonStyle.remove}
                    fullWidth
                    onClick={() => handleTouchTap(index, false)}/>
            </div>
        )
    })

    return (
        <div className={classes.wrapper}>
            <div className={classes.subTitle}>{t('Контакты')}</div>
            <div>{details}</div>
            <div className={classes.addAnother}>
                <FlatButton
                    label={t('Добавить контакт')}
                    labelStyle={buttonStyle.label}
                    fullWidth
                    onClick={() => handleTouchTap(null, true)}/>
            </div>
        </div>
    )
})

export default CompanyContactsField
