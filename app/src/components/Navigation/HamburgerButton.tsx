import React          from 'react';
import {MenuOutlined} from '@ant-design/icons';
import {Button}       from 'antd';
import {ButtonProps}  from 'antd/es/button/button';

const HamburgerButton = (props: ButtonProps) => {

   return <Button {...props} title="Navigation"
                  type="text"
                  icon={<MenuOutlined/>}
   />
}

export default HamburgerButton;