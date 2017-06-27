import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import ShopDetailsTab from './ShopDetailsTab'
import Tooltip from '../ToolTip'
import IconButton from 'material-ui/IconButton'
import Edit from 'material-ui/svg-icons/image/edit'
import Delete from 'material-ui/svg-icons/action/delete'

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            justifyContent: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        wrapper: {
            width: '100%',
            display: 'flex',
            alignSelf: 'baseline',
            color: '#333 !important',
            flexWrap: 'wrap',
            padding: '0 30px'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px #efefef solid',
            alignItems: 'center',
            width: '100%',
            height: '65px',
            margin: '0 -30px',
            padding: '0 30px'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: 'bold',
            cursor: 'pointer'
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        content: {
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%'
        },
        info: {
            display: 'flex'
        },
        infoBlock: {
            '&:first-child': {
                marginRight: '40px'
            }
        },
        infoTitle: {
            fontWeight: 'bold'
        },
        details: {
            display: 'inline-block',
            lineHeight: '25px',
            marginRight: '30px',
            marginTop: '10px'
        },
        image: {
            height: '165px',
            width: '165px',
            position: 'relative',
            '& img': {
                width: '100%',
                height: '100%',
                display: 'block'
            }
        },
        noImage: {
            background: '#efefef',
            border: '1px #ccc dashed',
            color: '#999',
            fontSize: '11px !important',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            '& span': {
                fontSize: '11px !important',
                display: 'block',
                position: 'relative',
                marginBottom: '20px',
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: '40px',
                    left: '50%',
                    background: '#999',
                    width: '64px',
                    height: '1px',
                    marginLeft: '-32px'
                }
            }
        }
    })
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

const ShopDetails = enhance((props) => {
    const {classes, loading, data, tabData, confirmDialog, updateDialog} = props
    console.log(data)
    const id = _.get(data, 'id')
    const name = _.get(data, 'name')
    const client = _.get(data, ['client', 'name'])
    const shopType = _.get(data, ['marketType', 'name'])
    const address = _.get(data, 'address')
    const guide = _.get(data, 'guide')
    const contactName = _.get(data, 'contactName')
    const phone = _.get(data, 'phone')
    const image = _.get(data, 'image')

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
                <div className={classes.titleLabel}>{name}</div>
                <div className={classes.titleButtons}>
                    <Tooltip position="bottom" text="Изменить">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip position="bottom" text="Удалить">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className={classes.content}>
                <div className={classes.info}>
                    <div className={classes.infoBlock}>
                        <div className={classes.infoTitle}>Детали</div>
                        <ul className={classes.details}>
                            <li>Клиент</li>
                            <li>Тип заведения</li>
                            <li>Зона</li>
                            <li>Адрес</li>
                            <li>Ориентир</li>
                        </ul>
                        <ul className={classes.details}>
                            <li>{client}</li>
                            <li>{shopType}</li>
                            <li>Наименование зоны (Z-0001)</li>
                            <li>{address}</li>
                            <li>{guide}</li>
                        </ul>
                    </div>
                    <div className={classes.infoBlock}>
                        <div className={classes.infoTitle}>Контакты</div>
                        <ul className={classes.details}>
                            <li>{contactName}</li>
                        </ul>
                        <ul className={classes.details}>
                            <li>{phone}</li>
                        </ul>
                    </div>
                </div>
                <div className={classes.image}>
                    {!image ? <div className={classes.noImage}>
                        <div>
                            <span>Фото <br/> отсутствует</span>
                            <a>добавить фото</a>
                        </div>
                    </div>
                        : <img src={image} alt=""/>}
                </div>
            </div>
            {/*<ShopDetailsTab*/}
                {/*tabData={tabData}*/}
                {/*data={data}*/}
            {/*/>*/}
        </div>
    )
})

ShopDetails.propTypes = {
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired,
    tabData: PropTypes.shape({
        tab: PropTypes.string.isRequired,
        handleTabChange: PropTypes.func.isRequired
    }),
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired

}

export default ShopDetails

