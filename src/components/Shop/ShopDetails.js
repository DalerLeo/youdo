import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import moment from 'moment'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import Edit from 'material-ui/svg-icons/image/edit'
import Delete from 'material-ui/svg-icons/action/delete'
import Add from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'
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
            display: 'flex'
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
            padding: '0 30px',
            position: 'relative',
            boxSizing: 'content-box'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: 'bold',
            cursor: 'pointer'
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: '100%'
        },
        frequency: {
            textAlign: 'right',
            lineHeight: '1',
            '& span': {
                display: 'block'
            }
        },
        status: {
            alignSelf: 'baseline',
            margin: '0 30px',
            color: '#fff',
            fontWeight: '600',
            padding: '20px 17px',
            height: '65px',
            lineHeight: '1',
            textAlign: 'center'
        },
        content: {
            padding: '20px 0',
            display: 'flex',
            width: '100%',
            '& > div': {
                marginRight: '7%',
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        info: {
            display: 'flex'
        },
        infoTitle: {
            fontWeight: 'bold'
        },
        details: {
            display: 'inline-block',
            lineHeight: '25px',
            marginRight: '30px',
            marginTop: '10px',
            '&:last-child': {
                marginRight: '0'
            }
        },
        image: {
            width: '230px',
            height: '165px',
            marginRight: 'calc(7% + 36px) !important',
            position: 'relative',
            '& span:nth-child(4)': {
                position: 'relative',
                zIndex: '1'
            },
            '& span:nth-child(4):after': {
                background: 'rgba(0,0,0,0.35)',
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
            }
        },
        imageWrapper: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            '& img': {
                width: '100%',
                height: '100%',
                cursor: 'pointer'
            }
        },
        otherImages: {
            order: '2',
            '& div': {
                cursor: 'pointer',
                width: '36px',
                height: '36px',
                marginBottom: '7px',
                position: 'relative',
                zIndex: '1',
                '&:last-child strong': {
                    display: 'flex !important'
                },
                '& strong': {
                    background: 'rgba(0,0,0, 0.35)',
                    display: 'none',
                    color: '#fff',
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    zIndex: '99'
                }
            }
        },
        firstImage: {
            width: '230px !important',
            height: '165px !important',
            display: 'block',
            marginRight: '7px',
            marginBottom: '0 !important',
            order: '1 !important'
        },
        addImg: {
            background: '#999',
            cursor: 'pointer',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0 !important',
            order: '3'
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
                height: 'auto !important',
                width: 'auto !important',
                margin: '0 0 20px !important',
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
    const {
        classes,
        loading,
        data,
        confirmDialog,
        updateDialog,
        addPhotoDialog,
        slideShowDialog,
        handleCloseDetail
    } = props

    const ZERO = 0
    const MAX_IMAGE_COUNT = 4
    const THREE = 3

    const EVERY_DAY = '1'
    const ONCE_IN_A_WEEK = '2'
    const TWICE_IN_A_WEEK = '3'
    const IN_A_DAY = '4'

    const id = _.get(data, 'id')
    const name = _.get(data, 'name')
    const client = _.get(data, ['client', 'name'])
    const createdBy = _.get(data, ['createdBy', 'firstName']) + ' ' + _.get(data, ['createdBy', 'secondName']) || 'Неизвестно'
    const createdDate = _.get(data, 'createdDate') ? moment(_.get(data, 'createdDate')).format('YY:MM:DD') : 'Неизвестно'
    const changedDate = _.get(data, 'modifiedDate') ? moment(_.get(data, 'modifiedDate')).format('YY:MM:DD') : 'Неизвестно'
    const changedBy = _.get(data, 'changedBy') ? _.get(data, ['changedBy', 'firstName']) + ' ' + _.get(data, ['changedBy', 'secondName'])
        : 'Неизвестно'
    const shopType = _.get(data, ['marketType', 'name'])
    const address = _.get(data, 'address')
    const guide = _.get(data, 'guide')
    const zone = _.get(data, ['border', 'title'])
    const contactName = _.get(data, 'contactName')
    const phone = _.get(data, 'phone')
    const images = _.get(data, 'images') || {}
    const freq = _.get(data, 'visitFrequency')
    const isActive = _.get(data, 'isActive')
    let slicedImages = images
    if (images.length > MAX_IMAGE_COUNT) {
        slicedImages = _.slice(images, ZERO, MAX_IMAGE_COUNT)
    }
    const moreImages = images.length - slicedImages.length

    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={40} thickness={4} />
                </div>
            </div>
        )
    }

    const primaryImage = _.map(images, (item, index) => {
        const src = _.get(item, 'file')
        const isPrimary = _.get(item, 'isPrimary')
        if (isPrimary) {
            return (
                <span key={index} className={classes.firstImage}>
                    <img src={src} alt="" onClick={() => { slideShowDialog.handleOpenSlideShowDialog(index) }}/>
                </span>
            )
        }
        return false
    })
    let count = 0
    const otherImages = _.map(images, (item, index) => {
        const src = _.get(item, 'file')
        const isPrimary = _.get(item, 'isPrimary')
        if (!isPrimary && (count++) < THREE) {
            return (
                <div key={index} className="smallImages">
                    {moreImages > ZERO && <strong onClick={() => { slideShowDialog.handleOpenSlideShowDialog(index) }}>{moreImages}+</strong>}
                    <img src={src} alt="" onClick={() => { slideShowDialog.handleOpenSlideShowDialog(index) }}/>
                </div>
            )
        }
        return false
    })

    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>{name}</div>
                <div className={classes.closeDetail}
                    onClick={handleCloseDetail}>
                </div>
                <div className={classes.titleButtons}>
                    <div className={classes.frequency}>
                        <span>Частота посещений:</span>
                        <b>{ freq === EVERY_DAY ? 'Каждый день' : (
                            freq === ONCE_IN_A_WEEK ? 'Раз в неделю' : (
                                freq === TWICE_IN_A_WEEK ? '2 раза в неделю' : (
                                    freq === IN_A_DAY ? 'Через день' : ''
                                )
                            )
                        )}</b>
                    </div>
                    {isActive ? <div className={classes.status} style={{background: '#81c784'}}>Магазин <br/> активен</div>
                        : <div className={classes.status} style={{background: '#ff717e'}}>Магазин <br/> неактивен</div>
                    }
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
                <div className={classes.image}>
                    {(images.length === ZERO) ? <div className={classes.noImage}>
                        <div>
                            <span>Фото <br/> отсутствует</span>
                            <a onClick={addPhotoDialog.handleOpenAddPhotoDialog}>добавить фото</a>
                        </div>
                    </div>
                        : <div className={classes.imageWrapper}>
                            {primaryImage}
                            <div className={classes.otherImages}>
                                {otherImages}
                            </div>
                            <div onClick={addPhotoDialog.handleOpenAddPhotoDialog} className={classes.addImg}>
                                <Add color="#fff"/>
                            </div>
                        </div>}
                </div>
                <div className={classes.infoBlock}>
                    <div className={classes.infoTitle}>Детали</div>
                    <ul className={classes.details}>
                        <li>Клиент</li>
                        <li>Создал</li>
                        <li>Дата создания</li>
                        <li>Изменил</li>
                        <li>Изменил</li>
                        <li>Тип заведения</li>
                        <li>Зона</li>
                    </ul>
                    <ul className={classes.details}>
                        <li>{client}</li>
                        <li>{createdBy}</li>
                        <li>{createdDate}</li>
                        <li>{changedBy}</li>
                        <li>{changedDate}</li>
                        <li>{shopType}</li>
                        <li>{!zone ? <span className="redFont">Не определена</span> : zone}</li>
                    </ul>
                </div>
                <div className={classes.infoBlock}>
                    <div className={classes.infoTitle}>Контакты</div>
                    <ul className={classes.details}>
                        <li>{contactName}</li>
                        <li>Адрес</li>
                        <li>Ориентир</li>
                    </ul>
                    <ul className={classes.details}>
                        <li>{phone}</li>
                        <li>{address}</li>
                        <li>{guide}</li>
                    </ul>
                </div>
            </div>
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
    }).isRequired,
    addPhotoDialog: PropTypes.shape({
        openAddPhotoDialog: PropTypes.bool.isRequired,
        handleOpenAddPhotoDialog: PropTypes.func.isRequired,
        handleCloseAddPhotoDialog: PropTypes.func.isRequired,
        handleSubmitAddPhotoDialog: PropTypes.func.isRequired
    }).isRequired,
    slideShowDialog: PropTypes.shape({
        openSlideShowDialog: PropTypes.bool.isRequired,
        gallery: PropTypes.object,
        galleryLoading: PropTypes.bool.isRequired,
        handleOpenSlideShowDialog: PropTypes.func.isRequired,
        handleCloseSlideShowDialog: PropTypes.func.isRequired
    }).isRequired
}
export default ShopDetails
