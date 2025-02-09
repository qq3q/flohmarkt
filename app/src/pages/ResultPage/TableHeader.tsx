import {Flex, Typography} from 'antd';
import {ReloadButton}     from '../../components/buttons';
import React              from 'react';

const TableHeader = (props: {
   text: string,

   [index: string]: any,
}) => {
   const {
      text,
      ...rest
   } = props;

   return <Flex
      justify="space-between"
      align="center"
   >
      <div>
         <Typography.Text strong>
            {text}
         </Typography.Text>
      </div>
      <ReloadButton {...rest}/>
   </Flex>
};

export default TableHeader;
