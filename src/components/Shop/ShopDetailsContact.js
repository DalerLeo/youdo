import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const enhance = compose(
    injectSheet({
        content: {
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'space-between'
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

const ShopDetailsContact = enhance((props) => {
    const {classes, data} = props
    const shopType = _.get(data, 'marketTypeName')
    const address = _.get(data, 'address')
    const guide = _.get(data, 'guide')
    const contactName = _.get(data, 'contactName')
    const phone = _.get(data, 'phone')
    const image = _.get(data, 'image')

    return (
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
                        <li>Жасур Эргашевич</li>
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
    )
})

ShopDetailsContact.propTypes = {
    data: PropTypes.object.isRequired
}

export default ShopDetailsContact
