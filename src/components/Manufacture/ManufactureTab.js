import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Col} from 'react-flexbox-grid'
import * as TAB from '../../constants/manufactureTab'
import {Tabs, Tab} from 'material-ui/Tabs'
import ManufactureProduct from './Tab/ManufactureProduct'
import ManufacturePerson from './Tab/ManufacturePerson'
import ManufactureEquipment from './Tab/ManufactureEquipment'
const enhance = compose(
    injectSheet({
        rightSide: {
            boxShadow: '-5px 0px 5px #E0E0E0;',
            padding: '8px 25px'
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
                backgroundColor: '#a6dff7 !important'
            },
            '& button': {
                color: 'black !important',
                backgroundColor: 'white !important'
            },
            '& button > span:first-line': {
                color: '#a6dff7'
            }
        }
    })
)

const ManufactureTab = enhance((props) => {
    const {classes, tabData, productFilterDialog, productData, personData, equipmentData} = props
    const tab = _.get(tabData, 'tab')
    return (
        <Col className={classes.rightSide} xs={6} md={8}>
            <div>
                <Tabs
                    className={classes.colorCat}
                    value={tab}
                    onChange={(value) => tabData.handleTabChange(value)}>
                    <Tab label="Продукция" value={TAB.MANUFACTURE_TAB_PRODUCT}/>
                    <Tab label="Персонал" value={TAB.MANUFACTURE_TAB_PERSON} />
                    <Tab label="Оборудование" value={TAB.MANUFACTURE_TAB_EQUIPMENT} />
                </Tabs>
                {TAB.MANUFACTURE_TAB_PRODUCT === tab && <ManufactureProduct
                    productData={productData}
                    filter={tabData.filter}
                    filterDialog={productFilterDialog} />}
                {TAB.MANUFACTURE_TAB_PERSON === tab && <ManufacturePerson
                    personData={personData}/>}
                {TAB.MANUFACTURE_TAB_EQUIPMENT === tab && <ManufactureEquipment
                    equipmentData={equipmentData}/>}
            </div>
        </Col>
    )
})
ManufactureTab.propTypes = {
    tabData: PropTypes.shape({
        tab: PropTypes.string.isRequired,
        handleTabChange: PropTypes.func.isRequired
    }),
    productData: PropTypes.object.isRequired,
    personData: PropTypes.object.isRequired,
    equipmentData: PropTypes.object.isRequired
}

export default ManufactureTab
