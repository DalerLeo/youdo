import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import LinearProgress from '../LinearProgress'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import Edit from 'material-ui/svg-icons/image/edit'
import Delete from 'material-ui/svg-icons/action/delete'
import Add from 'material-ui/svg-icons/content/add'
import ToolTip from '../ToolTip'
import t from '../../helpers/translate'
import MapDialog from './ShopMapDialog'

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
            flexWrap: 'wrap'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px #efefef solid',
            alignItems: 'center',
            width: '100%',
            height: '65px',
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
            textAlign: 'center',
            width: '110px'
        },
        content: {
            display: 'flex',
            width: '100%'
        },
        sidesStyle: {
            padding: '20px 30px',
            display: 'flex',
            width: '50%',
            '& > div': {
                marginRight: '50px',
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        leftSide: {
            extend: 'sidesStyle',
            borderRight: '1px #efefef solid',
            width: '55%'
        },
        rightSide: {
            extend: 'sidesStyle',
            width: '45%'
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
            '& li span': {
                fontWeight: '600',
                marginLeft: '5px',
                '& a': {
                    fontWeight: 'inherit'
                }
            },
            '&:last-child': {
                marginRight: '0'
            }
        },
        phonesWrapper: {
            position: 'relative'
        },
        phones: {
            position: 'absolute',
            top: '-5px',
            right: '-12px',
            textAlign: 'right',
            padding: '5px 12px 5px 8px',
            lineHeight: 'normal',
            '& span': {
                display: 'block',
                fontWeight: '600',
                marginLeft: '0 !important',
                marginBottom: '5px',
                '&:last-child': {
                    marginBottom: '0'
                }
            }
        },
        image: {
            width: '230px',
            height: '165px',
            marginRight: '30px !important',
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
            '& img': {
                width: '100%',
                height: '100%',
                cursor: 'pointer'
            }
        },
        otherImages: {
            order: '2',
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: '10px',
            '& div': {
                cursor: 'pointer',
                width: '38px',
                height: '38px',
                marginRight: '10px',
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
            marginRight: '0 !important',
            background: '#999',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0 !important',
            order: '3'
        },
        noImage: {
            background: '#f2f5f8',
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
                width: '90px !important',
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
    }),
    withState('openMapDialog', 'setOpenMapDialog', false),
    withState('showPhones', 'setShowPhones', true),
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
        handleCloseDetail,
        mapDialog,
        openMapDialog,
        setOpenMapDialog,
        showPhones,
        setShowPhones
    } = props

    const ZERO = 0
    const ONE = 1
    const MAX_IMAGE_COUNT = 5
    const FOUR = 4

    const EVERY_DAY = '1'
    const ONCE_IN_A_WEEK = '2'
    const TWICE_IN_A_WEEK = '3'
    const IN_A_DAY = '4'
    const id = _.get(data, 'id')
    const name = _.get(data, 'name')
    const okad = _.get(data, 'okad') || t('не указано')
    const bankAddress = _.get(data, 'bankAddress') || t('не указано')
    const checkAccount = _.get(data, 'checkingAccount') || t('не указано')
    const inn = _.get(data, 'inn') || t('не указано')
    const mfo = _.get(data, 'mfo') || t('не указано')
    const client = _.get(data, ['client', 'name'])
    const createdBy = _.get(data, 'createdBy')
        ? _.get(data, ['createdBy', 'firstName']) + ' ' + _.get(data, ['createdBy', 'secondName'])
        : t('Неизвестно')
    const responsibleAgent = _.get(data, 'responsibleAgent')
        ? _.get(data, ['responsibleAgent', 'firstName']) + ' ' + _.get(data, ['responsibleAgent', 'secondName'])
        : t('Неизвестно')
    const createdDate = _.get(data, 'createdDate') ? dateTimeFormat(_.get(data, 'createdDate')) : t('Неизвестно')
    const changedDate = _.get(data, 'modifiedDate') ? dateTimeFormat(_.get(data, 'modifiedDate')) : t('Неизвестно')
    const changedBy = _.get(data, 'changedBy')
        ? _.get(data, ['changedBy', 'firstName']) + ' ' + _.get(data, ['changedBy', 'secondName'])
        : t('Неизвестно')
    const shopType = _.get(data, ['marketType', 'name'])
    const address = _.get(data, 'address')
    const guide = _.get(data, 'guide')
    const zone = _.get(data, ['border', 'title']) || <span className="redFont">{t('Не определена')}</span>
    const contactName = _.get(data, 'contactName')
    const phones = _.get(data, 'phones')
    const firstPhone = _.get(_.first(phones), 'phone')
    const images = _.get(data, 'images') || []
    const freq = _.get(data, 'visitFrequency')
    const isActive = _.get(data, 'isActive')
    const slicedImages = images.length > MAX_IMAGE_COUNT ? _.slice(images, ZERO, MAX_IMAGE_COUNT) : images
    const moreImages = images.length - slicedImages.length

    if (loading) {
        return (
            <div className={classes.loader}>
                <LinearProgress/>
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
        if (!isPrimary && (count++) < FOUR) {
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
                        <span>{t('Частота посещений')}:</span>
                        <b>{ freq === EVERY_DAY ? t('Каждый день') : (
                            freq === ONCE_IN_A_WEEK ? t('Раз в неделю') : (
                                freq === TWICE_IN_A_WEEK ? t('2 раза в неделю') : (
                                    freq === IN_A_DAY ? t('Через день') : ''
                                )
                            )
                        )}</b>
                    </div>
                    {isActive ? <div className={classes.status} style={{background: '#81c784'}}>{t('Магазин активен')}</div>
                        : <div className={classes.status} style={{background: '#ff717e'}}>{t('Магазин неактивен')}</div>
                    }
                    <ToolTip position="bottom" text={t('Изменить')}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}>
                            <Edit />
                        </IconButton>
                    </ToolTip>
                    <ToolTip position="bottom" text={t('Удалить')}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}>
                            <Delete />
                        </IconButton>
                    </ToolTip>
                </div>
            </div>
            <div className={classes.content}>
                <div className={classes.leftSide}>
                    <div className={classes.image}>
                        {(images.length === ZERO) ? <div className={classes.noImage}>
                                <div>
                                    <span>{t('Фото отсутствует')}</span>
                                    <a onClick={addPhotoDialog.handleOpenAddPhotoDialog}>{t('добавить фото')}</a>
                                </div>
                            </div>
                            : <div className={classes.imageWrapper}>
                                {primaryImage}
                                <div className={classes.otherImages}>
                                    <div onClick={addPhotoDialog.handleOpenAddPhotoDialog} className={classes.addImg}>
                                        <Add color="#fff"/>
                                    </div>
                                    {otherImages}
                                </div>
                            </div>}
                    </div>
                    <div className={classes.infoBlock}>
                        <div className={classes.infoTitle}>{t('Детали')}</div>
                        <ul className={classes.details}>
                            <li>{t('Клиент')}: <span>{client}</span></li>
                            <li>{t('Создал')}: <span>{createdBy}</span></li>
                            <li>{t('Ответственный агент')}: <span>{responsibleAgent}</span></li>
                            <li>{t('Дата создания')}: <span>{createdDate}</span></li>
                            <li>{t('Дата изменения')}: <span>{changedDate}</span></li>
                            <li>{t('Изменил')}: <span>{changedBy}</span></li>
                            <li>{t('Тип заведения')}: <span>{shopType}</span></li>
                            <li>{t('Зона')}: <span>{zone}</span></li>
                        </ul>
                    </div>
                </div>
                <div className={classes.rightSide}>
                    <div className={classes.infoBlock}>
                        <div className={classes.infoTitle}>{t('Контакты')}</div>
                        <ul className={classes.details}>
                            <li>{t('Имя контакта')}: <span>{contactName}</span></li>
                            <li>{t('Адрес')}: <span><a onClick={() => { setOpenMapDialog(true) }}>{address}</a></span></li>
                            <li>{t('Ориентир')}: <span>{guide}</span></li>
                            <li onMouseEnter={() => { setShowPhones(true) }}>
                                {t('Телефоны')}: <span className={classes.phonesWrapper}>
                                {firstPhone}
                                {showPhones && _.get(phones, 'length') > ONE &&
                                <Paper zDepth={1}
                                       onMouseLeave={() => { setShowPhones(false) }}
                                       className={classes.phones}>
                                    {_.map(phones, (item) => {
                                        const phoneID = _.get(item, 'id')
                                        const ph = _.get(item, 'phone')
                                        return <span key={phoneID}>{ph}</span>
                                    })}
                                </Paper>}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className={classes.infoBlock}>
                        <div className={classes.infoTitle}>{t('Дополнительно')}</div>
                        <ul className={classes.details}>
                            <li>{t('Р/с')}: <span>{checkAccount}</span></li>
                            <li>{t('Адрес Банка')}: <span>{bankAddress}</span></li>
                            <li>{t('ИНН')}: <span>{inn}</span></li>
                            <li>{t('ОКЭД')}: <span>{okad}</span></li>
                            <li>{t('МФО')}: <span>{mfo}</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            {openMapDialog &&
            <MapDialog
                viewOnly={true}
                initialValues={mapDialog.initialValues}
                open={openMapDialog}
                onClose={() => { setOpenMapDialog(false) }}
                onSubmit={mapDialog.handleSubmitMapDialog}
            />}
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
