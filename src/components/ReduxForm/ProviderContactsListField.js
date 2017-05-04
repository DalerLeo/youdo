import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ContentRemove from 'material-ui/svg-icons/content/remove'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import {Field} from 'redux-form'
import TextField from './TextField'

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
            height: '30px',
            position: 'relative',
            '& button': {
                position: 'absolute !important',
                right: '0 !important'
            }
        },
        flex: {
            display: 'flex',
            '& div:first-child': {
                marginRight: '10px'
            }
        }
    })
)

const ProviderContactsListField = ({classes, fields}) => {
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
            {fields.map((contact, index) => {
                return (
                    <div>
                        <div className={classes.headers}>
                            <FloatingActionButton
                                backgroundColor="#12aaeb"
                                onTouchTap={() => handleTouchTap(index)}
                                mini={true}>
                                {fields.length !== index + ONE ? <ContentRemove/> : <ContentAdd />}
                            </FloatingActionButton>
                        </div>
                        <div key={index}>
                            <div>
                                <div>
                                    <Field
                                        label="Контактное лицо"
                                        name={`${contact}.name`}
                                        component={TextField}
                                        fullWidth={true}
                                    />

                                    <div className={classes.flex}>
                                        <Field
                                            label="Email"
                                            name={`${contact}.email`}
                                            component={TextField}
                                            fullWidth={true}
                                        />

                                        <Field
                                            label="Телефон номер"
                                            name={`${contact}.phone`}
                                            component={TextField}
                                            fullWidth={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default enhance(ProviderContactsListField)
