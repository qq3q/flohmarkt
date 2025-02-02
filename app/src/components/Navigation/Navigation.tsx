import React                                from 'react';
import {Dropdown, MenuProps} from 'antd';
import HamburgerButton                      from './HamburgerButton';

const Navigation = (props: {
   items: MenuProps['items'],
   disabled?: boolean,
}) => {
   const {items, disabled} = props;

   return <Dropdown
      disabled={disabled}
      menu={{items}}
      trigger={['click']}
   >
      <HamburgerButton/>
   </Dropdown>
}

export default Navigation;
