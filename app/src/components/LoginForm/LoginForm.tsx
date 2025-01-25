import React                 from 'react';
import type {FormProps}      from 'antd';
import {Button, Form, Input} from 'antd';

type FieldType = {
   username?: string; password?: string; remember?: string;
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
   console.log('Failed:', errorInfo);
};

const LoginForm = (props: {
   login: (username: string, password: string) => Promise<void>,
}) => {
   const {login} = props;

   const onFinish: FormProps<FieldType>['onFinish'] = (values) => {

      return login(values.username ?? '', values.password ?? '');
   };

   return (<Form
      name="basic"
      layout="vertical"
      variant="filled"
      requiredMark={false}
      labelCol={{span: 8}}
      wrapperCol={{span: 16}}
      style={{maxWidth: 600}}
      initialValues={{remember: true}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
   >
      <Form.Item<FieldType>
         label="Nutzer"
         name="username"
         rules={[{
            required: true,
            message:  'Please input your username!'
         }]}
      >
         <Input/>
      </Form.Item>

      <Form.Item<FieldType>
         label="Passwort"
         name="password"
         rules={[{
            required: true,
            message:  'Please input your password!'
         }]}
      >
         <Input.Password/>
      </Form.Item>

      <Form.Item label={null}>
         <Button
            type="primary"
            htmlType="submit"
         >
            Submit
         </Button>
      </Form.Item>
   </Form>)
};

export default LoginForm;
