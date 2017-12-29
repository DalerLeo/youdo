import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ContentRemove from 'material-ui/svg-icons/content/remove'
import {Field} from 'redux-form'
import TextField from '../Basic/TextField'
import IconButton from 'material-ui/IconButton'

/**
 * {['contacts', 'contactName', 'email', 'phoneNumber']}
 */

const enhance = compose(
    injectSheet({
        wrapper: {
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column'
        },
        title: {
            paddingTop: '15px',
            fontWeight: 'bold',
            color: 'black !important'
        },
        headers: {
            height: '0',
            position: 'relative',
            top: '-30px',
            '& button': {
                position: 'absolute !important',
                right: '0 !important'
            }
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            width: '300px',
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
        flex: {
            display: 'flex',
            '& div:first-child': {
                marginRight: '10px'
            }
        },
        contactBlock: {
            display: 'flex',
            alignItems: 'center'
        }
    })
)

const iconStyle = {
    icon: {
        color: '#bac6ce',
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
const MarketPhoneListField = (props) => {
    const {classes, fields} = props
    const ONE = 1

    const handleTouchTap = (index) => {
        const LAST_INDEX = index + ONE

        if (fields.length === LAST_INDEX) {
            return fields.push({})
        }

        return fields.remove(index)
    }
    return (
        <div>
            {fields.map((phone, index) => {
                return (
                    <div className={classes.contactBlock}>
                        <div key={index}>
                            <div className={classes.flex}>
                                <Field
                                    label="Телефон номер"
                                    name={`${phone}.phone`}
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                />
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
            })}
        </div>
    )
}

export default enhance(MarketPhoneListField)
