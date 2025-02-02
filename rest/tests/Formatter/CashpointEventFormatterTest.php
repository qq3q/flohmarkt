<?php

namespace App\Tests\Formatter;

use App\Entity\Event;
use App\Entity\Seller;
use App\Entity\Transaction;
use App\Entity\Unit;
use App\Enum\PaymentType;
use App\Formatter\CashpointEventFormatter;
use Doctrine\Common\Collections\ArrayCollection;
use PHPUnit\Framework\TestCase;

class CashpointEventFormatterTest extends TestCase
{
   public function testFormatWithoutTransactions(): void
   {
      $event = $this->createMock(Event::class);
      $event->method('getTitle')->willReturn('Sample Event');
      $event->method('getDonationRate')->willReturn(0.05);
      $event->method('getTransactions')->willReturn(new ArrayCollection([]));

      $formatter = new CashpointEventFormatter();
      $result    = $formatter->format($event);

      $this->assertEquals('Sample Event', $result['title']);
      $this->assertEquals(0.05, $result['donationRate']);
      $this->assertEmpty($result['transactions']);
   }

   public function testFormatWithTransactions(): void
   {
      $unit = $this->createConfiguredMock(Unit::class, [
         'getId'     => 101,
         'getAmount' => 50.0,
         'getSeller' => $this->createConfiguredMock(Seller::class, [
            'getId' => 201,
         ]),
      ]);

      $transaction = $this->createConfiguredMock(Transaction::class, [
         'getId'                   => 1,
         'getCreatedAt'            => new \DateTimeImmutable('2023-10-10 12:00:00'),
         'getPaymentType'          => PaymentType::Cash,
         'getUnitsOfActiveSellers' => new ArrayCollection([$unit]),
      ]);

      $event = $this->createMock(Event::class);
      $event->method('getTitle')->willReturn('Sample Event');
      $event->method('getDonationRate')->willReturn(0.10);
      $event->method('getTransactions')->willReturn(new ArrayCollection([$transaction]));

      $formatter = new CashpointEventFormatter();
      $result    = $formatter->format($event);

      $this->assertEquals('Sample Event', $result['title']);
      $this->assertEquals(0.10, $result['donationRate']);
      $this->assertCount(1, $result['transactions']);
      $this->assertEquals([
         'id'          => 1,
         'createdAt'   => '2023-10-10 12:00:00',
         'paymentType' => 'Cash',
         'units'       => [
            [
               'id'       => 101,
               'amount'   => 50,
               'sellerId' => 201,
            ],
         ],
      ], $result['transactions'][0]);
   }
}
