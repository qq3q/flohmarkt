import {Dropdown, MenuProps} from 'antd';
import HamburgerButton       from './HamburgerButton';

const Navigation = (props: {
   items: MenuProps['items'],
}) => {
   const {items} = props;

   return <Dropdown
      menu={{items}}
      trigger={['click']}
   >
      <HamburgerButton/>
   </Dropdown>
}

export default Navigation;
