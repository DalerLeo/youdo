import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'

const enhance = compose(
    injectSheet({

        imgContent: {
            '& img': {
                width: '33%',
                margin: '1px'
            },
            height: '390px',
            boxSizing: 'border-box',
            overflowY: 'scroll'
        }
    })
)

const ShopDetailsImg = enhance((props) => {
    const {classes} = props
    return (
        <div className={classes.imgContent}>
            <img src="https://thumb9.shutterstock.com/display_pic_with_logo/1637849/350102345/stock-photo-shopping-cart-full-of-food-in-the-supermarket-aisle-high-internal-view-horizontal-composition-350102345.jpg" alt=""/>
            <img src="https://thumb9.shutterstock.com/display_pic_with_logo/1637849/350102345/stock-photo-shopping-cart-full-of-food-in-the-supermarket-aisle-high-internal-view-horizontal-composition-350102345.jpg" alt=""/>
            <img src="https://thumb9.shutterstock.com/display_pic_with_logo/1637849/350102345/stock-photo-shopping-cart-full-of-food-in-the-supermarket-aisle-high-internal-view-horizontal-composition-350102345.jpg" alt=""/>
            <img src="https://thumb9.shutterstock.com/display_pic_with_logo/1637849/350102345/stock-photo-shopping-cart-full-of-food-in-the-supermarket-aisle-high-internal-view-horizontal-composition-350102345.jpg" alt=""/>
            <img src="https://thumb9.shutterstock.com/display_pic_with_logo/1637849/350102345/stock-photo-shopping-cart-full-of-food-in-the-supermarket-aisle-high-internal-view-horizontal-composition-350102345.jpg" alt=""/>
        </div>
    )
})
ShopDetailsImg.propTypes = {
    // data: React.PropTypes.object.isRequired,
    // loading: React.PropTypes.bool.isRequired
}

export default ShopDetailsImg
