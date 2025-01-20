import {Button} from 'antd';
import React    from 'react';

export const AppButton = (props: {
   children: React.ReactNode,

   [index: string]: any,
}) => {
   const {children, ...rest} = props;

   return <Button
      {...rest}
      type="primary"
   >
      {children}
   </Button>
}

export const DeleteButton = (props: {
   children?: React.ReactNode,

   [index: string]: any,
}) => {
   const {children, ...rest} = props;

   return <AppButton
      title="Löschen"
      {...rest}
      danger
   >
      {children ?? 'Löschen'}
   </AppButton>
}

export const AddButton = (props: {
   children?: React.ReactNode,

   [index: string]: any,
}) => {
   const {children, ...rest} = props;

   return <AppButton
      title="Neu"
      {...rest}
   >
      {children ?? 'Neu'}
   </AppButton>
}

export const SaveButton = (props: {
   children?: React.ReactNode,

   [index: string]: any,
}) => {
   const {children, ...rest} = props;

   return <AppButton
      title="Speichern"
      {...rest}
   >
      {children ?? 'Speichern'}
   </AppButton>
}

export const ResetButton = (props: {
   children?: React.ReactNode,

   [index: string]: any,
}) => {
   const {children, ...rest} = props;

   return <AppButton
      title="Zurücksetzen"
      {...rest}
   >
      {children ?? 'Zurücksetzen'}
   </AppButton>
}
