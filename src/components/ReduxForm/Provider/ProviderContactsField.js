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
            },
            '& svg': {
                width: '20px !important',
                height: '20px !important'
            },
            '& label': {
                top: '-2px',
                marginLeft: '-7px'
            }
        },
        error: {
            textAlign: 'center',
            fontSize: '14px',
            color: 'red'
        }
    })
    ,
    connect((state) => {
        const contacts = _.get(state, ['provider', 'contacts', 'data'])
        const contactsLoading = _.get(state, ['provider', 'contacts', 'loading'])
        return {
            contacts,
            contactsLoading
        }
    })
)

const ProviderContactsField = enhance((props) => {
    const {classes, contacts, contactsLoading, input, meta: {error}} = props
    return (
        <div>
            { contactsLoading && <div>Загрузка  ...</div> }
            {error && <div className={classes.error}>{error}</div>}
            {!contactsLoading && <RadioButtonGroup name="contact" className={classes.radioButton}
                                                   onChange={input.onChange} defaultSelected={input.value}>
                {_.map(contacts, (item) => {
                    const id = _.get(item, 'id')
                    const value = _.get(item, 'name') + ' ' + _.get(item, 'phone') + ' ' + _.get(item, 'email')
                    return (
                        <RadioButton key={id}
                            value={id}
                            label={value}
                        />
                    )
                })}
            </RadioButtonGroup>}
        </div>
    )
})

export default ProviderContactsField
