import {Button} from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

const LogoutButton = (props: {
   [index: string]: any
}) => {

   return <Button {...props} title="Abmelden" type="default" shape="circle" icon={<LogoutOutlined />} />
}

export default LogoutButton;
