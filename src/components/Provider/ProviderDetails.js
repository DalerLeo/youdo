import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import {Row, Col} from 'react-flexbox-grid'
import DeleteIcon from 'material-ui/svg-icons/action/delete'

const colorBlue = '#12aaeb !important'
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        wrapper: {
            color: '#333 !important',
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            '& a': {
                color: colorBlue
            }
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '65px',
            padding: '0 30px',
            borderBottom: '1px #efefef solid'
        },
        container: {
            display: 'flex',
            width: '100%'
        },
        sides: {
            flexBasis: '27%'
        },
        leftSide: {
            extend: 'sides',
            borderRight: '1px #efefef solid',
            padding: '20px 30px'
        },
        rightSide: {
            extend: 'sides',
            borderLeft: '1px #efefef solid',
            padding: '20px 30px'
        },
        body: {
            flexBasis: '66%',
            padding: '20px 30px',
            '& .dottedList': {
                padding: '10px 0',
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                },
                '&:first-child': {
                    padding: '0 0 10px'
                },
                '&:last-child': {
                    padding: '10px 0 0',
                    '&:after': {
                        display: 'none'
                    }
                }
            }
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '700'
        },
        bodyTitle: {
            fontWeight: '600',
            marginBottom: '10px'
        }
    }),
    withState('openDetails', 'setOpenDetails', false)
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}
withState('openDetails', 'setOpenDetails', false)

const tooltipPosition = 'bottom-center'

const ProviderDetails = enhance((props) => {
    const {classes,
        loading,
        data,
        confirmDialog,
        handleOpenUpdateDialog
    } = props

    const providerId = _.get(data, 'id')
    const contacts = _.get(data, 'contacts')
    const date = moment(_.get(data, ['data', 'createdDate'])).format('DD.MM.YYYY')
    const address = _.get(data, 'address') || 'N/A'
    const providerName = _.get(data, 'name')

    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={100} thickness={6}/>
                </div>
            </div>
        )
    }

    return (
        <div className={classes.wrapper} key={_.get(data, 'id')}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>{providerName}</div>
                <div className={classes.titleButtons}>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        disableTouchRipple={true}
                        onTouchTap={() => { handleOpenUpdateDialog(providerId) }}
                        tooltipPosition={tooltipPosition}
                        tooltip="Изменить">
                        <Edit />
                    </IconButton>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        disableTouchRipple={true}
                        onTouchTap={confirmDialog.handleOpenConfirmDialog}
                        tooltipPosition={tooltipPosition}
                        tooltip="Удалить">
                        <DeleteIcon />
                    </IconButton>
                </div>
            </div>
            <div className={classes.container}>
                <div className={classes.leftSide}>
                    <div className={classes.bodyTitle}>Адрес</div>
                    <div>{address}</div>
                </div>
                <div className={classes.body}>
                    <div className={classes.bodyTitle}>Контакты</div>
                    <div>
                        {_.map(contacts, (item) => {
                            const name = _.get(item, 'name')
                            const phone = _.get(item, 'phone')
                            const email = _.get(item, 'email')
                            return (
                                <Row key={item.id} className="dottedList">
                                    <Col xs={4}>{name}</Col>
                                    <Col xs={4}>{email}</Col>
                                    <Col xs={4}>{phone}</Col>
                                </Row>
                            )
                        })}
                    </div>
                </div>
                <div className={classes.rightSide}>
                    <div className={classes.bodyTitle}>Дата добавления</div>
                    <div>{date}</div>
                </div>
            </div>
        </div>
    )
})

ProviderDetails.propTypes = {
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    confirmDialog: PropTypes.object.isRequired,
    handleOpenUpdateDialog: PropTypes.func.isRequired,
}

export default ProviderDetails
