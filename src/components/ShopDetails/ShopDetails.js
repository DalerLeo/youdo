import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import AddAPhoto from 'material-ui/svg-icons/image/add-a-photo'
import Edit from 'material-ui/svg-icons/image/edit'
import {Col} from 'react-flexbox-grid'

const enhance = compose(
    injectSheet({
        wrapper: {
            width: '100%',
            display: 'flex'
        },
        leftSide: {
            boxSizing: 'border-box',
            background: '#fbfbfc',
            padding: '20px 35px'
        },
        rightSide: {
            boxShadow: '-5px 0px 5px #E0E0E0;',
            padding: '0 25px'
        },
        title: {
            padding: '20px 0',
            display: 'flex',
            position: 'relative',
            borderBottom: 'dashed 1px'
        },
        titleLabel: {
            color: '#333333',
            fontWeight: 'bold',
            fontSize: '18px'
        },
        titleButtons: {
            position: 'absolute',
            right: '0',
            marginTop: '-25px',
            marginRight: '-20px'
        },
        top: {
            borderBottom: 'dashed 1px',
            padding: '15px 0'
        },
        miniTitle: {
            fontWeight: 'bold',
            marginBottom: '5px'
        },
        item: {
            display: 'flex',
            marginBottom: '5px'
        },
        typeLabel: {
            width: '40%',
            color: '#5d6474'
        },
        typeValue: {
            width: '80%'
        },
        bottom: {
            padding: '15px 0'
        },
        category: {
            display: 'flex',
            listStyle: 'none',
            borderBottom: '1px solid #e8e8e8',
            paddingLeft: 0,
            '& li': {
                padding: '5px 15px',
                '&:hover': {
                    color: 'blue',
                    borderBottom: '2px solid blue'
                }
            }
        },

        active: {
            color: 'blue',
            borderBottom: '2px solid blue'
        },
        imgContent: {
            '& img': {
                width: '33%',
                margin: '1px'
            },
            height: '400px',
            boxSizing: 'border-box',
            overflowY: 'scroll'
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
            padding: 0
        }
    }

    return (
        <div className={classes.wrapper} key={itemId}>
            <Col className={classes.leftSide} xs={6} md={4}>
                <div className={classes.title}>
                    <div className={classes.titleLabel}>
                        OOO Jrem Vkusn
                    </div>
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
                <div className={classes.top}>
                    <div className={classes.miniTitle}>Детали</div>
                    <div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Тип заведения
                            </div>
                            <div className={classes.typeValue}>
                                Суппер маркет
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Адрес
                            </div>
                            <div className={classes.typeValue}>
                                Ziyo said kochasi166-uy
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Ориентир
                            </div>
                            <div className={classes.typeValue}>
                                Напротив кинотеатра Казахстан
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Телефон
                            </div>
                            <div className={classes.typeValue}>
                                +98935000755
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Контактное лицо
                            </div>
                            <div className={classes.typeValue}>
                                Жасур Эргашевич
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
                                Нигматуллаев Нигматулла
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Телефон
                            </div>
                            <div className={classes.typeValue}>
                                +98935000755
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div className={classes.typeLabel}>
                                Email
                            </div>
                            <div className={classes.typeValue}>
                                nigmatulla.n@gmail.com
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col className={classes.rightSide} xs={6} md={8}>
                <div>
                    <ul className={classes.category}>
                        <li className={classes.active}>Карта</li>
                        <li>Статистика</li>
                        <li>Активность</li>
                        <li>Фотографии</li>
                    </ul>
                    <div className={classes.imgContent}>
                        <img src="https://thumb9.shutterstock.com/display_pic_with_logo/1637849/350102345/stock-photo-shopping-cart-full-of-food-in-the-supermarket-aisle-high-internal-view-horizontal-composition-350102345.jpg" alt=""/>
                        <img src="https://thumb9.shutterstock.com/display_pic_with_logo/1637849/350102345/stock-photo-shopping-cart-full-of-food-in-the-supermarket-aisle-high-internal-view-horizontal-composition-350102345.jpg" alt=""/>
                        <img src="https://thumb9.shutterstock.com/display_pic_with_logo/1637849/350102345/stock-photo-shopping-cart-full-of-food-in-the-supermarket-aisle-high-internal-view-horizontal-composition-350102345.jpg" alt=""/>
                        <img src="https://thumb9.shutterstock.com/display_pic_with_logo/1637849/350102345/stock-photo-shopping-cart-full-of-food-in-the-supermarket-aisle-high-internal-view-horizontal-composition-350102345.jpg" alt=""/>
                        <img src="https://thumb9.shutterstock.com/display_pic_with_logo/1637849/350102345/stock-photo-shopping-cart-full-of-food-in-the-supermarket-aisle-high-internal-view-horizontal-composition-350102345.jpg" alt=""/>
                    </div>
                </div>
            </Col>
        </div>
    )
})

ShopDetails.propTypes = {
    data: React.PropTypes.object.isRequired
}

export default ShopDetails
