import {Flex, MenuProps, Space, Typography} from 'antd';
import Navigation                           from '../Navigation';
import {NavLink}     from 'react-router';
import {RoutePath}   from '../../container/AppRouterProvider/types';
import LogoutButton  from '../LogoutButton';
import React         from 'react';

const Header = (props: {
   disabled: boolean,
   username: string,
   navItems: MenuProps['items'],
   onLogout: () => void | Promise<void>,
}) => {
   const {disabled = false, username, navItems, onLogout} = props;

   return  <Flex
      justify="space-between"
      align="center"
   >
      <Space>
         <Navigation disabled={disabled} items={navItems}/>
         {disabled
            ? <Typography.Text disabled strong>Flohmarkt 2</Typography.Text>
            : <NavLink to={RoutePath.Home}><Typography.Text strong>Flohmarkt 2</Typography.Text></NavLink>
         }
      </Space>
      <Space>
         {username}
         <LogoutButton
            disabled={disabled}
            onClick={onLogout}
         />
      </Space>
   </Flex>
}

export default Header;
