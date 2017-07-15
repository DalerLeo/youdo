import _ from 'lodash'
import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import Edit from 'material-ui/svg-icons/image/edit'
import Delete from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'
import {Row, Col} from 'react-flexbox-grid'
import Tooltip from '../ToolTip'

const colorBlue = '#12aaeb !important'
const enhance = compose(
    injectSheet({
        dottedList: {
            padding: '20px 0'
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
        loader: {
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
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
            fontWeight: '700',
            cursor: 'pointer'
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        bodyTitle: {
            fontWeight: '600',
            marginBottom: '10px'
        },
        closeDetail: {
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer',
            zIndex: '1'
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

const ClientDetails = enhance((props) => {
    const {classes,
        loading,
        data,
        updateDialog,
        confirmDialog,
        handleCloseDetail
    } = props
    const detId = _.get(data, 'id')
    const contacts = _.get(data, 'contacts')
    const date = moment(_.get(data, 'createdDate')).format('DD.MM.YYYY')
    const address = _.get(data, 'address') || 'N/A'
    const providerName = _.get(data, 'name')

    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={40} thickness={4}/>
                </div>
            </div>
        )
    }

    return (
        <div className={classes.wrapper} key={detId}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>{providerName}</div>
                <div className={classes.closeDetail}
                     onClick={handleCloseDetail}>
                </div>
                <div className={classes.titleButtons}>
                    <Tooltip position="bottom" text="Изменить">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={ () => { updateDialog.handleOpenUpdateDialog(detId) }}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip position="bottom" text="Удалить">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={confirmDialog.handleOpenConfirmDialog}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
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
                            const phone = _.get(item, 'telephone')
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

ClientDetails.propTypes = {
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    detailData: PropTypes.object,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired
}

export default ClientDetails
