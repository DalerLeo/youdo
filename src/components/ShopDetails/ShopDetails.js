import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import AddAPhoto from 'material-ui/svg-icons/image/add-a-photo'
import Edit from 'material-ui/svg-icons/image/edit'
import CircularProgress from 'material-ui/CircularProgress'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Col} from 'react-flexbox-grid'

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
            paddingBottom: '20px',
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
            marginTop: '-20px',
            marginRight: '-25px'
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
                '&:visited': {
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
        },
        colorCat: {
            borderBottom: '2px solid #e8e8e8',
            marginBottom: '20px',
            '& > div': {
                width: '60% !important'
            },
            '& > div:nth-child(2) > div': {
                marginTop: '0px !important',
                marginBottom: '-2px',
                backgroundColor: 'blue !important'
            },
            // '& > div:nth-child(2)':{
            //     backgroundColor: '#e8e8e8'
            // },
            '& button': {
                color: 'black !important',
                backgroundColor: 'white !important'
            },
            '& button > span:first-line': {
                color: 'blue'
            },
            '& button div:nthChild(2)': {
                backgroundColor: 'white !important'
            }
        },
        loader: {
            width: '100%',
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
)
const ShopDetails = enhance((props) => {
    const {classes, loading, data} = props
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
                    <div className={classes.titleLabel}>
                        {name}
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
            <Col className={classes.rightSide} xs={6} md={8}>
                <div>
                    <Tabs className={classes.colorCat}>
                        <Tab label="Карта" value={0} />
                        <Tab label="Статистика" value={1} />
                        <Tab label="Активность" value={2} />
                        <Tab label="Фотографии" value={3} />
                    </Tabs>

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
    data: React.PropTypes.object.isRequired,
    loading: React.PropTypes.bool.isRequired
}

export default ShopDetails
