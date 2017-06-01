import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import {Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import Edit from 'material-ui/svg-icons/image/edit'
import Delete from 'material-ui/svg-icons/action/delete'

const enhance = compose(
    injectSheet({
        wrapper: {
            width: '100%',
            display: 'flex'
        },
        loader: {
            width: '100%',
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        leftSide: {
            boxSizing: 'border-box',
            background: '#fbfbfc',
            padding: '20px 35px'
        },
        title: {
            paddingBottom: '20px',
            padding: '20px 0',
            display: 'flex',
            position: 'relative',
            borderBottom: 'dashed 1px',
            marginTop: '-25px'
        },
        titleLabel: {
            color: '#333333',
            fontWeight: 'bold',
            fontSize: '18px'
        },
        titleButtons: {
            position: 'absolute',
            right: '0',
            marginTop: '-20px',
            marginRight: '-25px'
        },
        top: {
            borderBottom: 'dashed 1px',
            paddingTop: '20px'
        },
        miniTitle: {
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#333333'
        },
        item: {
            display: 'flex',
            marginBottom: '20px'
        },
        typeLabel: {
            width: '40%',
            color: '#5d6474'
        },
        typeValue: {
            width: '80%',
            color: '#1d1d1d'
        },
        bottom: {
            paddingTop: '20px'
        }
    })
)

const iconStyle = {
    icon: {
        width: 30,
        height: 30
    },
    button: {
        width: 66,
        height: 66,
        padding: 0
    }
}

const tooltipPosition = 'bottom-center'

const TransactionDetails = enhance((props) => {
    const {classes, loading, data, confirmDialog, handleOpenUpdateDialog} = props
    const name = _.get(data, 'name') || 'N/A'
    const type = _.get(data, 'categoryName') || 'N/A'
    const address = _.get(data, 'address') || 'N/A'
    const guide = _.get(data, 'guide') || 'N/A'
    const phone = _.get(data, 'phone') || 'N/A'
    const contactName = _.get(data, 'contactName') || 'N/A'
    const agentName = _.get(data, 'agentName') || 'N/A'
    const agentPhone = _.get(data, 'agentPhone') || 'N/A'
    const agentEmail = _.get(data, 'agentEmail') || 'N/A'

    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={100} thickness={6} />
                </div>
            </div>
        )
    }

    return (
        <div className={classes.wrapper}>
            <Col className={classes.leftSide} xs={6} md={4}>
                <div className={classes.title}>
                    <div className={classes.titleLabel}>{name}</div>
                    <div className={classes.titleButtons}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            tooltipPosition={tooltipPosition}
                            onTouchTap={handleOpenUpdateDialog}
                            tooltip="Edit">
                            <Edit />
                        </IconButton>

                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={confirmDialog.handleOpenConfirmDialog}
                            tooltipPosition={tooltipPosition}
                            tooltip="Delete">
                            <Delete />
                        </IconButton>
                    </div>
                </div>
                <div className={classes.top}>
                    <div className={classes.miniTitle}>Детали</div>
                    <div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Тип заведения
                            </div>
                            <div className={classes.typeValue}>
                                {type}
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Адрес
                            </div>
                            <div className={classes.typeValue}>
                                {address}
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Ориентир
                            </div>
                            <div className={classes.typeValue}>
                                {guide}
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Телефон
                            </div>
                            <div className={classes.typeValue}>
                                {phone}
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Контактное лицо
                            </div>
                            <div className={classes.typeValue}>
                                {contactName}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.bottom}>
                    <div className={classes.miniTitle}>Агент</div>
                    <div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Фамилия и имя
                            </div>
                            <div className={classes.typeValue}>
                                {agentName}
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Телефон
                            </div>
                            <div className={classes.typeValue}>
                                {agentPhone}
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Email
                            </div>
                            <div className={classes.typeValue}>
                                {agentEmail}
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </div>
    )
})

TransactionDetails.propTypes = {
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleExpenseConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    handleOpenUpdateDialog: PropTypes.func.isRequired

}

export default TransactionDetails

