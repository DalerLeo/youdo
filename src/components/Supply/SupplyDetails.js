import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import Edit from 'material-ui/svg-icons/image/edit'
import Delete from 'material-ui/svg-icons/action/delete'

const enhance = compose(
    injectSheet({
        wrapper: {
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            padding: '20px 30px'
        },
        loader: {
            width: '100%',
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '20px 0',
            margin: '-20px 0 0'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '600'
        },
        details: {
            extend: 'title',
            background: '#f2f5f8',
            padding: '23px 30px',
            margin: '0 -30px'
        },
        payInfo: {
            display: 'flex'
        }
    })
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 18,
        height: 18
    },
    button: {
        width: 30,
        height: 30,
        padding: 0
    }
}

const tooltipPosition = 'bottom-center'

const SupplyDetails = enhance((props) => {
    const {classes, loading, data} = props
    const id = _.get(data, 'id')

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
            <div className={classes.title}>
                <div className={classes.titleLabel}>Заказ №{id}</div>
                <div className={classes.titleButtons}>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        tooltipPosition={tooltipPosition}
                        tooltip="Edit">
                        <Edit />
                    </IconButton>

                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        tooltipPosition={tooltipPosition}
                        tooltip="Delete">
                        <Delete />
                    </IconButton>
                </div>
            </div>

            <div className={classes.details}>
                <div className={classes.payInfo}>
                    <div className={classes.paid}>Оплачено: 150000</div>
                    <div className={classes.remain} style={{marginLeft: '45px'}}>Баланс: 50000</div>
                </div>
                <div className={classes.dateInfo}>Товар будет доставлен: 22.04.2017</div>
            </div>
        </div>
    )
})

SupplyDetails.propTypes = {
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    handleOpenUpdateDialog: PropTypes.func.isRequired

}

export default SupplyDetails

