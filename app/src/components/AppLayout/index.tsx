import React                                                           from 'react';
import {Flex, Layout as AntdLayout, LayoutProps, SiderProps, Skeleton} from 'antd';
import {HEADER_HEIGHT}                                                 from './constants';

export class PageLayout extends React.Component<LayoutProps> {

   render() {
      const {
         children,
         ...rest
      } = this.props;

      return <AntdLayout
         style={{
            minHeight: '100vh',
            minWidth:  '800px'
         }}
         {...rest}
      >
         {children}
      </AntdLayout>;
   }

   static Header = (props: LayoutProps) => {
      const {
         children,
         ...rest
      } = props;

      return <AntdLayout.Header
         style={{height: HEADER_HEIGHT}}
         {...rest}
      >
         {children}
      </AntdLayout.Header>
   }

   static Content = (props: LayoutProps) => {
      const {
         children,
         ...rest
      } = props;

      return <AntdLayout.Content
         {...rest}
      >
         {children}
      </AntdLayout.Content>;
   }
}

export class Layout extends React.Component<LayoutProps> {

   render() {
      const {
         children,
         ...rest
      } = this.props;

      return <AntdLayout {...rest}>{children}</AntdLayout>;
   }

   static Content = (props: LayoutProps) => {
      const {
         children,
         ...rest
      } = props;

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
   };

   static ContentLoading = () => {

      return <Flex
         vertical
         justify="center"
         align="center"
         style={{height: '100vh'}}
      >
         <Skeleton/>
      </Flex>
   }

   static Sider = (props: SiderProps) => {
      const {
         children,
         ...rest
      } = props;

      return <AntdLayout.Sider
         collapsible={true}
         width="22em"
         style={{padding: '0.5em'}}
         {...rest}
      >
         {children}
      </AntdLayout.Sider>
   }
}
