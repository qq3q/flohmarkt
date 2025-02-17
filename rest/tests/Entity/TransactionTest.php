<?php

namespace App\Tests\Entity;

use App\Entity\Seller;
use App\Entity\Transaction;
use App\Entity\Unit;
use PHPUnit\Framework\TestCase;

class TransactionTest extends TestCase
{
   public function testGetUnitsOfActiveSellersWithSomeInactiveSellers()
   {
      $transaction = new Transaction();

      $activeSeller   = $this->createSeller(true);
      $inactiveSeller = $this->createSeller(false);

      $unit1 = $this->createUnit($activeSeller);
      $unit2 = $this->createUnit($inactiveSeller);

      $transaction->addUnit($unit1);
      $transaction->addUnit($unit2);

      $result = $transaction->getUnitsOfActiveSellers();

      $this->assertCount(1, $result);
      $this->assertTrue($result->contains($unit1));
      $this->assertFalse($result->contains($unit2));
   }

   public function testGetUnitsOfActiveSellersWithNoUnits()
   {
      $transaction = new Transaction();

      $result = $transaction->getUnitsOfActiveSellers();

      $this->assertCount(0, $result);
   }

   private function createSeller(bool $isActive): Seller
   {
      $seller = $this->createStub(Seller::class);
      $seller->method('isActive')->willReturn($isActive);

      return $seller;
   }

   private function createUnit(Seller $seller): Unit
   {
      $unit = $this->createStub(Unit::class);
      $unit->method('getSeller')->willReturn($seller);

      return $unit;
   }
}
