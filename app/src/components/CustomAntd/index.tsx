import {
   List as AntdList,
   Table as AntdTable,
   ListProps, TableProps
} from 'antd';

export const List = (props: ListProps<any>) => {

   return <AntdList
      size="small"
      bordered={false}
      {...props}
   />
}

export const ListItem = AntdList.Item;

export const Table = (props: TableProps) => {

   return <AntdTable
      size="small"
      {...props}
   />
}
