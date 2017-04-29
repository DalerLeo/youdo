import _ from 'lodash'
import React from 'react'
import {compose, withReducer, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import DeleteIcon from '../DeleteIcon'
import TextField from './TextField'

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
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),

    withHandlers({
        handleAdd: props => () => {
            const contactName = _.get(props, ['contactName', 'input', 'value'])
            const email = _.get(props, ['email', 'input', 'value'])
            const phoneNumber = _.get(props, ['phoneNumber', 'input', 'value'])

            const onChange = _.get(props, ['contacts', 'input', 'onChange'])
            const contacts = _.get(props, ['contacts', 'input', 'value'])

            if (!_.isEmpty(contactName) && email && phoneNumber) {
                onChange(_.union(contacts, [{contactName, email, phoneNumber}]))
            }
        },

        handleRemove: props => (listIndex) => {
            const onChange = _.get(props, ['contacts', 'input', 'onChange'])
            const contacts = _(props)
                .get(['contacts', 'input', 'value'])
                .filter((item, index) => index !== listIndex)

            onChange(contacts)
        }
    })
)

const ProviderContactsListField = ({classes, handleAdd, handleRemove, ...defaultProps}) => {
    const contacts = _.get(defaultProps, ['contacts', 'input', 'value']) || []

    return (
        <div>
            <div className={classes.headers}>
                <FloatingActionButton
                    backgroundColor="#12aaeb"
                    onTouchTap={handleAdd}
                    mini={true}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
            <div>
                {_.map(contacts, (item, index) => (
                    <div key={index}>
                        <TextField
                            label="Контактное лицо"
                            {..._.get(item, ['contactName', 'text'])}/>
                        <TextField
                            label="Email"
                            {..._.get(item, 'email')}/>
                        <TextField
                            label="Телефон номер"
                            {..._.get(item, 'phoneNumber')}/>
                        <IconButton onTouchTap={() => handleRemove(index)}>
                            <DeleteIcon color="#666666"/>
                        </IconButton>
                    </div>
                ))}
                <div>
                    <TextField
                        label="Контактное лицо"
                        {..._.get(defaultProps, 'contactName')}
                        fullWidth={true}
                    />
                    <div className={classes.flex}>
                        <TextField
                            label="Email"
                            {..._.get(defaultProps, 'email')}
                        />
                        <TextField
                            label="Телефон номер"
                            {..._.get(defaultProps, 'phoneNumber')}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default enhance(ProviderContactsListField)
