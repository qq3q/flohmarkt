import React             from 'react';
import {Checkbox, Space} from 'antd';
import {DeleteButton}    from '../buttons';
import {useState}        from 'react';
import {ButtonProps}     from 'antd/es/button/button';

const DeleteConfirmButton = (props: ButtonProps) => {
   const [confirmed, setConfirmed] = useState<boolean>(false);

   return <Space>
      <Checkbox
         checked={confirmed}
         title={confirmed ? 'Löschen nicht erlauben' : 'Löschen erlauben'}
         onChange={() => setConfirmed(!confirmed)}
      />
      <DeleteButton
         {...props}
         disabled={!confirmed}
      />
   </Space>
}

export default DeleteConfirmButton;
