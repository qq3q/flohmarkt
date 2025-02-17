import React, {useImperativeHandle, useRef} from 'react';
import {GetProps, Input}                    from 'antd';

type OTPProps = GetProps<typeof Input>;

interface Props {
   value: string | number,
   onChange: (text: string) => void,

   [index: string ]: any,
}

const PositiveIntegerInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
   const {
      value,
      onChange,
      ...rest
   } = props;

   const inputRef = useRef(null);
   useImperativeHandle(ref, () => {
      if(!inputRef.current) {

         throw new Error('Input element not found in reference.')
      }

      return inputRef.current;
   }, []);

   const changeHandler: OTPProps['onChange'] = (ev) => {
      const val = ev.currentTarget.value.replace(/\D/g, '');
      onChange(val);
   };

   return <Input
      {...rest}
      ref={inputRef}
      value={value}
      onChange={changeHandler}
   />
})

export default PositiveIntegerInput;
