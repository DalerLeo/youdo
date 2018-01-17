import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import ContentAdd from 'material-ui/svg-icons/content/add-circle-outline'
import ContentRemove from 'material-ui/svg-icons/content/remove-circle-outline'
import {Field} from 'redux-form'
import TextField from '../Basic/TextField'
import IconButton from 'material-ui/IconButton'
import ToolTip from '../../ToolTip'

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
            {_.reverse(fields).map((phone, index) => {
                return (
                    <div key={index} className={classes.contactBlock}>
                        <div>
                            <div className={classes.flex}>
                                <Field
                                    label="Номер телефона"
                                    name={`${phone}.phone`}
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                />
                            </div>
                        </div>
                        <ToolTip position="bottom" text={fields.length !== index + ONE ? 'Убрать' : 'Добавить еще'}>
                            <IconButton
                                onTouchTap={() => handleTouchTap(index)}
                                iconStyle={iconStyle.icon}
                                style={iconStyle.button}>
                                {fields.length !== index + ONE ? <ContentRemove/> : <ContentAdd />}
                            </IconButton>
                        </ToolTip>
                    </div>
                )
            })}
        </div>
    )
}

export default enhance(MarketPhoneListField)
