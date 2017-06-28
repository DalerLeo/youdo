import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import TextField from '../Basic/TextField'

/**
 * {['contacts', 'contactName', 'email', 'phoneNumber']}
 */

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
        contactBlock: {
            marginTop: '10px',
            '&:first-child': {
                marginTop: '0'
            }
        },
        subTitle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: '600',
            marginBottom: '10px'
        }
    })
)

const ShopContactsListField = (props) => {
    const {classes, fields} = props
    const ZERO = 0
    const ONE = 1
    const handleTouchTap = (index) => {
        const LAST_INDEX = index + ONE

        if (fields.length === LAST_INDEX) {
            return fields.push({})
        }

        return fields.remove(index)
    }
    if (fields.length === ZERO) {
        fields.push({})
    }
    return (
        <div>
            {fields.map((contact, index) => {
                return (
                    <div className={classes.contactBlock}>
                        <div className={classes.subTitle}>
                            <span>Контакт</span>
                            <a onClick={() => handleTouchTap(index)}>
                                {fields.length !== index + ONE ? '- удалить' +
                                ' контакт' : '+ добавить контакт'}
                            </a>
                        </div>
                        <div key={index}>
                            <Field
                                name={`${contact}.phone`}
                                component={TextField}
                                className={classes.inputFieldCustom}
                                label="Телефон"
                                fullWidth={true}/>
                            <Field
                                name={`${contact}.contactName`}
                                component={TextField}
                                className={classes.inputFieldCustom}
                                label="Контактное лицо"
                                fullWidth={true}/>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default enhance(ShopContactsListField)