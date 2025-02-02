<?php

namespace App\Tests\Enum;

use App\Enum\PaymentType;
use DomainException;
use PHPUnit\Framework\TestCase;

class PaymentTypeTest extends TestCase
{
   public function testToEnumWithValidValuesCash(): void
   {
      $result = PaymentType::toEnum('Cash');
      $this->assertSame(PaymentType::Cash, $result);
      $result = PaymentType::toEnum('PayPal');
      $this->assertSame(PaymentType::PayPal, $result);
   }

   public function testToEnumWithInvalidValue(): void
   {
      $this->expectException(DomainException::class);
      $this->expectExceptionMessage('Invalid Payment Type');
      PaymentType::toEnum('InvalidType');
   }
}
