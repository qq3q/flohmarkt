import React                            from 'react';
import {Alert as AntdAlert, AlertProps} from 'antd';

export const Error = (props: AlertProps) => {
   return <AntdAlert
      message="Fehler"
      showIcon
      {...props}
      type="error"
   />
}

export const Warning = (props: AlertProps) => {
   return <AntdAlert
      message="Warnung"
      showIcon
      {...props}
      type="warning"
   />
}
