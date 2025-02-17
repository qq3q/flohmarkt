import React from 'react';

const List = (props: {
   children: React.ReactNode;
}) => {
   const {children} = props;

   return <ul style={{margin: 0, padding: 0,}}>{children}</ul>;
};

export default List;
