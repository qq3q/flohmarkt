import {Flex}                                    from 'antd';
import {AMOUNT_BEFORE_ID_WIDTH, SELLER_ID_WIDTH} from './constants';
import {Typography}                              from 'antd';

const FormHead = () => {

   return <Flex gap="middle" style={{marginBottom: '0.5em'}}>
      <label
         style={{
            width: SELLER_ID_WIDTH,
         }}
      >
         <Typography.Text type="secondary">Verk.-nr.</Typography.Text>
      </label>
      <label
         style={{
            width: AMOUNT_BEFORE_ID_WIDTH,
         }}
      >
         <Typography.Text type="secondary">Betrag Euro</Typography.Text>
      </label>
      <label>
         <Typography.Text type="secondary">Betrag Cent</Typography.Text>
      </label>
   </Flex>

}

export default FormHead;
