<?php

namespace App\Enum;

use DomainException;

enum PaymentType: string
{
   case Cash = 'Cash';
   case PayPal = 'PayPal';

   /**
    * @throws DomainException
    */
   public static function toEnum(string $value): self
   {
      return match ($value)
      {
         'Cash' => self::Cash,
         'PayPal' => self::PayPal,
         default => throw new DomainException('Invalid Payment Type'),
      };
   }
}
