<?php

namespace App\Tests\Service;

use App\Entity\Seller;
use App\Entity\Transaction;
use App\Entity\Unit;
use App\Enum\PaymentType;
use App\Exception\InvalidDataException;
use App\Repository\SellerRepository;
use App\Service\FillTransactionService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use stdClass;

class FillTransactionServiceTest extends TestCase
{
   private FillTransactionService $sut;
   private EntityManagerInterface $entityManager;
   private SellerRepository       $sellerRepository;

   protected function setUp(): void
   {
      $this->entityManager    = $this->createMock(EntityManagerInterface::class);
      $this->sellerRepository = $this->createMock(SellerRepository::class);
      $this->sut              = new FillTransactionService($this->entityManager, $this->sellerRepository);
   }

   /**
    * @throws InvalidDataException
    */
   public function testFill_WithValidData(): void
   {
      $data              = new stdClass();
      $data->paymentType = "Cash";
      $data->units       = [
         (object)[
            'amount'   => 100.0,
            'sellerId' => 123,
         ]
      ];

      $transaction = new Transaction();;
      $transaction
         ->setPaymentType(PaymentType::PayPal)
         ->addUnit(new Unit());

      $this->sellerRepository
         ->expects($this->once())
         ->method('find')
         ->with(123)
         ->willReturn((new Seller())->setId(123)->setActive(true));

      $this->entityManager
         ->expects($this->once())
         ->method('persist')
         ->with($this->isInstanceOf(Unit::class));

      $this->sut->fill($transaction, $data);

      $this->assertSame(PaymentType::Cash, $transaction->getPaymentType());
      $this->assertCount(1, $transaction->getUnits());
      $unit = $transaction->getUnits()->first();
      $this->assertSame(100.0, $unit->getAmount());
      $this->assertSame(123, $unit->getSeller()->getId());
      $this->assertSame($transaction, $unit->getTransaction());
   }

   public function testFill_WithInvalidPaymentType_ThrowsInvalidDataException(): void
   {
      $this->expectException(InvalidDataException::class);
      $this->expectExceptionMessage('Invalid payment type.');

      $transaction = $this->createMock(Transaction::class);

      $data              = new stdClass();
      $data->paymentType = "InvalidPayment";

      $this->sut->fill($transaction, $data);
   }

   public function testFill_WithNonExistingSeller_ThrowsInvalidDataException(): void
   {
      $this->expectException(InvalidDataException::class);
      $this->expectExceptionMessage('Seller not found.');

      $transaction = $this->createMock(Transaction::class);

      $data              = new stdClass();
      $data->paymentType = "Cash";
      $data->units       = [
         (object)[
            'amount'   => 100.0,
            'sellerId' => 123,
         ]
      ];

      $this->sellerRepository
         ->method('find')
         ->with(123)
         ->willReturn(null);

      $this->sut->fill($transaction, $data);
   }

   public function testFill_WithInactiveSeller_ThrowsInvalidDataException(): void
   {
      $this->expectException(InvalidDataException::class);
      $this->expectExceptionMessage('Seller is not active.');

      $transaction = $this->createMock(Transaction::class);

      $data              = new stdClass();
      $data->paymentType = "Cash";
      $data->units       = [
         (object)[
            'amount'   => 100.0,
            'sellerId' => 123,
         ]
      ];

      $seller = $this->createMock(Seller::class);
      $seller->method('isActive')->willReturn(false);

      $this->sellerRepository
         ->method('find')
         ->with(123)
         ->willReturn($seller);

      $this->sut->fill($transaction, $data);
   }
}
