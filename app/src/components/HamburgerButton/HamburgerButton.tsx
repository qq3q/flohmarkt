import {MenuOutlined} from '@ant-design/icons';
import {Button}       from 'antd';

const HamburgerButton = (props: {
   [index: string]: any,
}) => {

   return <Button {...props} title="Navigation" type="text" icon={<MenuOutlined />} />
}

export default HamburgerButton;