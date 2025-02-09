import {
   List as AntdList,
   Table as AntdTable,
   ListProps, TableProps
} from 'antd';
import React from 'react';

// @todo use class component for List and add Item (see Table below)
export const List = (props: ListProps<any>) => {

   return <AntdList
      size="small"
      bordered={false}
      {...props}
   />
}

export const ListItem = AntdList.Item;

export class Table extends React.Component<TableProps> {
   static Summary = AntdTable.Summary;

   render() {
      return <AntdTable
         size="small"
         {...this.props}
      />
   }
}

// @todo add Row

