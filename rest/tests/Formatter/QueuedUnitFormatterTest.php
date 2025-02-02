<?php

namespace App\Tests\Formatter;

use App\Entity\QueuedUnit;
use App\Formatter\QueuedUnitFormatter;
use PHPUnit\Framework\TestCase;

class QueuedUnitFormatterTest extends TestCase
{
   public function testFormatReturnsCorrectArray(): void
   {
      $unit = $this->createQueuedUnit(123, 456.78);

      $formatter = new QueuedUnitFormatter();
      $result    = $formatter->format($unit);

      $this->assertIsArray($result);
      $this->assertArrayHasKey('sellerId', $result);
      $this->assertArrayHasKey('amount', $result);
      $this->assertSame(123, $result['sellerId']);
      $this->assertSame(456.78, $result['amount']);
   }

   public function testFormatHandlesNullSellerIdAndAmount(): void
   {
      $unit = $this->createQueuedUnit(null, null);

      $formatter = new QueuedUnitFormatter();
      $result    = $formatter->format($unit);

      $this->assertIsArray($result);
      $this->assertArrayHasKey('sellerId', $result);
      $this->assertArrayHasKey('amount', $result);
      $this->assertNull($result['sellerId']);
      $this->assertNull($result['amount']);
   }

   public function testFormatArrayReturnsCorrectArray(): void
   {
      $units = [
         $this->createQueuedUnit(1, 10.0),
         $this->createQueuedUnit(2, 20.0),
         $this->createQueuedUnit(3, 30.0),
      ];

      $formatter = new QueuedUnitFormatter();
      $result    = $formatter->formatArray($units);

      $this->assertIsArray($result);
      $this->assertCount(3, $result);
      $this->assertSame([
         ['sellerId' => 1, 'amount' => 10.0],
         ['sellerId' => 2, 'amount' => 20.0],
         ['sellerId' => 3, 'amount' => 30.0],
      ], $result);
   }

   public function testFormatArrayHandlesEmptyInput(): void
   {
      $formatter = new QueuedUnitFormatter();
      $result    = $formatter->formatArray([]);

      $this->assertIsArray($result);
      $this->assertEmpty($result);
   }

   private function createQueuedUnit(?int $sellerId, ?float $amount): QueuedUnit
   {
      $unit = $this->getMockBuilder(QueuedUnit::class)
         ->disableOriginalConstructor()
         ->onlyMethods(['getSellerId', 'getAmount'])
         ->getMock();

      $unit->method('getSellerId')->willReturn($sellerId);
      $unit->method('getAmount')->willReturn($amount);

      return $unit;
   }
}
