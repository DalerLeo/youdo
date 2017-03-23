import React from 'react'
import {withState} from 'recompose'
import Container from '../Container'
import SidebarMenu from '../SidebarMenu'
import {Button, Sidebar, Segment, Menu, Icon} from 'semantic-ui-react'

const enhance = withState('visible', 'setVisible', false)

const Layout = enhance((props) => {
    const {visible, setVisible, handleSignOut} = props

    return (
        <Container>
            <Sidebar.Pushable as={Segment}>
                <SidebarMenu visible={visible} />
                <Sidebar.Pusher>
                    <Menu attached="top">
                        <Menu.Item>
                            <Button onClick={() => setVisible(!visible)} icon={true}>
                                <Icon name="list layout" />
                            </Button>
                        </Menu.Item>
                        <Menu.Item position="right">
                            <Button
                                secondary={true}
                                onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        </Menu.Item>
                    </Menu>
                    <Segment basic>
                        {props.children}
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </Container>
    )
})

export default Layout
