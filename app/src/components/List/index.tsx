import {
   List as AntdList,
   ListProps
} from 'antd';

export const List = (props: ListProps<any>) => {

   return <AntdList
      size="small"
      bordered={false}
      {...props}
   />
}

export const ListItem = AntdList.Item;
