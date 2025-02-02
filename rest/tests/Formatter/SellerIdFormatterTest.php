<?php

namespace App\Tests\Formatter;

use App\Entity\Seller;
use App\Formatter\SellerIdFormatter;
use PHPUnit\Framework\TestCase;

class SellerIdFormatterTest extends TestCase
{
   private SellerIdFormatter $formatter;

   protected function setUp(): void
   {
      $this->formatter = new SellerIdFormatter();
   }

   public function testFormatReturnsSellerId(): void
   {
      $seller = $this->createSeller(1);

      $result = $this->formatter->format($seller);

      $this->assertSame(1, $result);
   }

   public function testFormatThrowsExceptionWhenSellerIdIsNull(): void
   {
      $this->expectException(\DomainException::class);
      $this->expectExceptionMessage('Seller id is null');

      $seller = $this->createSeller(null);

      $this->formatter->format($seller);
   }

   public function testFormatArrayReturnsArrayOfSellerIds(): void
   {
      $seller1 = $this->createSeller(1);
      $seller2 = $this->createSeller(2);
      $sellers = [$seller1, $seller2];

      $result = $this->formatter->formatArray($sellers);

      $this->assertSame([1, 2], $result);
   }

   private function createSeller(?int $id): Seller
   {
      $seller = $this->getMockBuilder(Seller::class)
         ->disableOriginalConstructor()
         ->onlyMethods(['getId'])
         ->getMock();

      $seller->method('getId')->willReturn($id);

      return $seller;
   }
}
