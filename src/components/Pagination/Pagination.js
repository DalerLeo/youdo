import _ from 'lodash'
import React from 'react'
import {hashHistory} from 'react-router'
import {Menu, Icon} from 'semantic-ui-react'

const Pagination = ({filter}) => {
    const prev = filter.prevPage()
    const next = filter.nextPage()

    console.log(prev, next)

    const pageItems = _.map(filter.pageItemList(), (item, index) => {
        const pageNumber = index + 1
        const url = filter.createURL({page: pageNumber})
        const active = pageNumber === filter.getCurrentPage()

        return (
            <Menu.Item
                key={index}
                active={active}
                onTouchTap={() => hashHistory.push(url)}>
                {pageNumber}
            </Menu.Item>
        )
    })

    if (!filter.hasPagination()) {
        return null
    }

    return (
        <Menu pagination>
            <Menu.Item
                icon={true}
                onTouchTap={() => prev && hashHistory.push(prev)}>
                <Icon name="left chevron" />
            </Menu.Item>
            {pageItems}
            <Menu.Item
                icon={true}
                onTouchTap={() => next && hashHistory.push(next)}>
                <Icon name="right chevron" />
            </Menu.Item>
        </Menu>
    )
}

Pagination.propTypes = {
    filter: React.PropTypes.object.isRequired
}

export default Pagination
