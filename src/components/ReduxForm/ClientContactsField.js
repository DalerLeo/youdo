import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import {connect} from 'react-redux'

const enhance = compose(
    injectSheet({
        radioButton: {
            marginTop: '10px',
            '&>div': {
                marginBottom: '10px'
            }
        }
    })
    ,
    connect((state) => {
        const contacts = _.get(state, ['client', 'contacts', 'data'])
        const contactsLoading = _.get(state, ['client', 'contacts', 'loading'])
        return {
            contacts,
            contactsLoading
        }
    })
)

const ClientContactsField = enhance((props) => {
    const {classes, contacts, contactsLoading} = props
    return (
        <div>
            { contactsLoading && <div>Загрузка  ...</div> }
            {!contactsLoading && <RadioButtonGroup name="contact" className={classes.radioButton} >
                {_.map(contacts, (item) => {
                    const id = _.get(item, 'id')
                    const value = _.get(item, 'name') + ' ' + _.get(item, 'telephone') + ' ' + _.get(item, 'email')
                    return (
                        <RadioButton
                            key={id}
                            value={id}
                            label={value}
                        />
                    )
                })}
            </RadioButtonGroup>}
        </div>
    )
})

export default ClientContactsField
