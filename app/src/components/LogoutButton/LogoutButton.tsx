import React            from 'react';
import {Button}         from 'antd';
import {LogoutOutlined} from '@ant-design/icons';
import {ButtonProps}    from 'antd/es/button/button';

const LogoutButton = (props: ButtonProps) => {

   return <Button {...props} title="Abmelden"
                  type="default"
                  shape="circle"
                  icon={<LogoutOutlined/>}
   />
}

export default LogoutButton;
