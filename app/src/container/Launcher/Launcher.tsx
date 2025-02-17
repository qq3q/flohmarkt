import React, {ReactNode, useEffect} from 'react';
import {observer}                    from 'mobx-react-lite';
import {useRootStore}                from '../../stores/RootStore';

const Launcher = observer((props: {
   children: ReactNode;
}) => {
   const {securityStore} = useRootStore();
   useEffect(() => {
      if (securityStore.state === 'uninitialized') {
         (() => securityStore.initialize())();
      }
   }, [securityStore]);

   if (securityStore.state === 'initialized') {

      return <>{props.children}</>;
   }

   return null;
})

export default Launcher;
