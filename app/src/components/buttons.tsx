import {Button} from 'antd';
import React    from 'react';
import {ButtonProps} from 'antd/es/button/button';
import {ReloadOutlined} from '@ant-design/icons';

export const AppButton = (props: ButtonProps) => {
   const {children, ...rest} = props;

   return <Button
      {...rest}
      type="primary"
   >
      {children}
   </Button>
}

export const DeleteButton = (props: ButtonProps) => {
   const {children, ...rest} = props;

   return <AppButton
      title="Löschen"
      {...rest}
      danger
   >
      {children ?? 'Löschen'}
   </AppButton>
}

export const AddButton = (props: ButtonProps) => {
   const {children, ...rest} = props;

   return <AppButton
      title="Neu"
      {...rest}
   >
      {children ?? 'Neu'}
   </AppButton>
}

export const SaveButton = (props: ButtonProps) => {
   const {children, ...rest} = props;

   return <AppButton
      title="Speichern"
      {...rest}
   >
      {children ?? 'Speichern'}
   </AppButton>
}

export const ResetButton = (props: ButtonProps) => {
   const {children, ...rest} = props;

   return <AppButton
      title="Zurücksetzen"
      {...rest}
   >
      {children ?? 'Zurücksetzen'}
   </AppButton>
}

export const ReloadButton = (props: ButtonProps) => {

   return <Button
      type="text"
      shape="circle"
      icon={<ReloadOutlined/>}
      {...props}
   />
}
