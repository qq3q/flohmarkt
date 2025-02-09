import {
   List as AntdList,
   Table as AntdTable,
   Row as AntdRow,
   ListProps, TableProps, RowProps
}            from 'antd';
import React from 'react';

export class List extends React.Component<ListProps<any>> {

   render() {

      return <AntdList
         size="small"
         bordered={false}
         {...this.props}
      />
   }

   static Item = AntdList.Item;
}

export class Table extends React.Component<TableProps> {
   static Summary = AntdTable.Summary;

   render() {
      return <AntdTable
         size="small"
         {...this.props}
      />
   }
}

export const Row = (props: RowProps) => <AntdRow gutter={8} {...props}/>
