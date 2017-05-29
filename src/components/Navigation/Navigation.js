import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Dropdown, Image, Menu } from 'semantic-ui-react'
import { actions as authActions } from '../../auth/dux'
import './Navigation.css'

export const Navigation = (props) => {
  return (
    <Menu attached="top" inverted className="Navigation">
      <Menu.Item header>
        <Image src={process.env.PUBLIC_URL + '/static/images/icons/icon-192x192.png'} size="mini" />
      </Menu.Item>
      <Menu.Item as={NavLink} exact to="/">Dashboard</Menu.Item>
      <Menu.Menu position="right">
        <Dropdown item trigger={<Image src={props.user.photoURL} avatar />} className="user">
          <Dropdown.Menu>
            <Dropdown.Header content={props.user.displayName} />
            <Dropdown.Item onClick={props.signOutRequest}>Sign Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.user
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(authActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)