import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import {connect} from 'react-redux'
import t from '../../../helpers/translate'

const enhance = compose(
    injectSheet({
        radioButton: {
            marginTop: '10px',
            '& > div': {
                marginBottom: '10px'
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
    }),
    connect((state) => {
        const contacts = _.get(state, ['provider', 'contacts', 'data'])
        const contactsLoading = _.get(state, ['provider', 'contacts', 'loading'])
        const detail = _.get(state, ['supply', 'item', 'data'])
        return {
            contacts,
            contactsLoading,
            detail
        }
    })
)

const ProviderContactsField = enhance((props) => {
    const {classes, contacts, contactsLoading, input, meta: {error}, detail} = props
    return (
        <div>
            {contactsLoading && <div>{t('Загрузка')}...</div>}
            {error && <div className={classes.error}>{error}</div>}
            {!contactsLoading &&
            <RadioButtonGroup
                name="contact"
                className={classes.radioButton}
                onChange={input.onChange}
                defaultSelected={_.toInteger(input.value)}>
                {_.map(contacts, (item) => {
                    const id = _.toInteger(_.get(item, 'id'))
                    const forLabel = _.get(item, 'name') + ' ' + _.get(item, 'phone') + ' ' + _.get(item, 'email')
                    return (
                        <RadioButton
                            key={id}
                            value={id}
                            label={forLabel}
                            iconStyle={{width: 20, height: 20}}
                            disableTouchRipple={true}
                            checked={!_.get(detail, ['contact', 'id']) === _.get(item, 'id')}
                        />
                    )
                })}
            </RadioButtonGroup>}
        </div>
    )
})

export default ProviderContactsField
