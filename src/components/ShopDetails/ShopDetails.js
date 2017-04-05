import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'

import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import AddAPhoto from 'material-ui/svg-icons/image/add-a-photo'
import Edit from 'material-ui/svg-icons/image/edit'

import {Col, Row} from 'react-flexbox-grid';

import './ShopDetails.css';


const enhance = compose(
    injectSheet({
        main: {
            width: '100%'
        },
        leftBlock: {
            background: '#fbfbfc'
        },
        rightBlock: {
            background: '#fff',
            boxShadow: 'rgba(0, 0, 0, 0) 0 0 0, rgba(0, 0, 0, 0.227451) -2px 0 30px'
        },
        shop_title: {
            padding:'20px',

        }
    })
)


const ShopDetails = enhance((props) => {
    const {classes, itemId} = props

    const tooltipPosition = 'bottom-center'

    const iconStyle = {
        icon: {
            width: 30,
            height: 30
        },
        button: {
            width: 66,
            height: 66,
            padding: 16
        }
    }

    return (
        <div className={classes.main} key={itemId}>
            <Row><Col className="shop__left_block" xs={6} md={4}>
                <div className={classes.shop_title}>
                    <div className="shop__title_label">
                        OOO Jrem Vkusn
                    </div>
                    <div className="shop__title_buttons">
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
                            tooltip="Add a photo">
                            <AddAPhoto />
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
                <div className="shop___top">
                    <div className="shop___mini_title">Детали</div>
                    <div className="shop___info">
                        <div className="shop___item">
                            <div className="shop___label">
                                Тип заведения
                            </div>
                            <div className="shop___value">
                                Суппер маркет
                            </div>
                        </div>
                        <div className="shop___item">
                            <div className="shop___label">
                                Адрес
                            </div>
                            <div className="shop___value">
                                Ziyo said kochasi166-uy
                            </div>
                        </div>
                        <div className="shop___item">
                            <div className="shop___label">
                                Ориентир
                            </div>
                            <div className="shop___value">
                                Напротив кинотеатра Казахстан
                            </div>
                        </div>
                        <div className="shop___item">
                            <div className="shop___label">
                                Телефон
                            </div>
                            <div className="shop___value">
                                +98935000755
                            </div>
                        </div>
                        <div className="shop___item">
                            <div className="shop___label">
                                Контактное лицо
                            </div>
                            <div className="shop___value">
                                Жасур Эргашевич
                            </div>
                        </div>
                    </div>
                </div>
                <div className="shop___bottom">
                    <div className="shop___mini_title">Агент</div>
                    <div className="shop___info">
                        <div className="shop___item">
                            <div className="shop___label">
                                Фамилия и имя
                            </div>
                            <div className="shop___value">
                                Нигматуллаев Нигматулла
                            </div>
                        </div>
                        <div className="shop___item">
                            <div className="shop___label">
                                Телефон
                            </div>
                            <div className="shop___value">
                                +98935000755
                            </div>
                        </div>
                        <div className="shop___item">
                            <div className="shop___label">
                                Email
                            </div>
                            <div className="shop___value">
                                nigmatulla.n@gmail.com
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
                <Col className="shop__right_block" xs={6} md={8}>
                    <div>

                    </div>
                </Col>
            </Row>
        </div>
    )
})

ShopDetails.propTypes = {
    item: React.PropTypes.object.isRequired
}


export default ShopDetails
