import React         from 'react';
import {Flex, Space} from 'antd';

const ListItem = (props: {
   children: React.ReactNode,
}) => {
   const {
      children
   } = props;

   return <li
      style={{
         margin:    '0 0 0.5em 0',
         padding:   0,
         listStyle: 'none',
      }}
   >
      {children}
   </li>
}

export default ListItem;
