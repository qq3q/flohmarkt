import React                                  from 'react';
import {Flex, Layout as AntdLayout, Skeleton} from 'antd';
import {HEADER_HEIGHT}                        from './constants';

export const PageLayout = (props: {
   children: React.ReactNode;

   [index: string]: any;
}) => {
   const {children, ...rest} = props;

   return <AntdLayout
      style={{minHeight: '100vh', minWidth: '800px'}}
      {...rest}
   >
      {children}
   </AntdLayout>;
}

export const PageHeader = (props: {
   children: React.ReactNode;

   [index: string]: any;
}) => {
   const {children, ...rest} = props;

   return <AntdLayout.Header
      style={{height: HEADER_HEIGHT}}
      {...rest}
   >
      {children}
   </AntdLayout.Header>
}

export const PageContent = (props: {
   children: React.ReactNode;

   [index: string]: any;
}) => {
   const {children, ...rest} = props;

   return <AntdLayout.Content
      {...rest}
   >
      {children}
   </AntdLayout.Content>;
}

export const Layout = (props: {
   children: React.ReactNode;

   [index: string]: any;
}) => {
   const {children, ...rest} = props;

   return <AntdLayout {...rest}>{children}</AntdLayout>;
}

export const Content = (props: {
   children: React.ReactNode;

   [index: string]: any;
}) => {
   const {children, ...rest} = props;

   return <AntdLayout.Content
      style={{
         background: '#fff',
         padding:    '0.5em',
         minHeight:  `calc(100vh - ${HEADER_HEIGHT})`
      }}
      {...rest}
   >
      {children}
   </AntdLayout.Content>;
}

export const ContentLoading = () => {

   return <Flex vertical justify="center" align="center" style={{height: '100vh'}}>
      <Skeleton/>
   </Flex>
}

export const Sider = (props: {
   children: React.ReactNode;

   [index: string]: any;
}) => {
   const {children, ...rest} = props;

   return <AntdLayout.Sider
      collapsible={true}
      width="22em"
      style={{padding: '0.5em'}}
      {...rest}
   >
      {children}
   </AntdLayout.Sider>
}
