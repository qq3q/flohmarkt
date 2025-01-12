<?php

namespace App\Enum;

enum PaymentType: string
{
   case Cash = 'Cash';
   case PayPal = 'PayPal';

   public static function toEnum(string $value): self {
      switch($value) {
         case 'Cash': return self::Cash;
         case 'PayPal': return self::PayPal;
         // @todo
         default: throw new \Exception('Invalid Payment Type');
      }
   }
}
