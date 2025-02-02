<?php

namespace App\Service;

use App\Entity\Transaction;
use App\Entity\Unit;
use App\Enum\PaymentType;
use App\Exception\InvalidDataException;
use App\Repository\SellerRepository;
use Doctrine\ORM\EntityManagerInterface;
use DomainException;
use stdClass;

readonly class FillTransactionService
{
   public function __construct(
      private EntityManagerInterface $em,
      private SellerRepository       $sellerRepo,
   )
   {
   }

   /**
    * @throws InvalidDataException
    */
   public function fill(Transaction $transaction, mixed $data): void
   {
      try
      {
         $transaction->setPaymentType(PaymentType::toEnum($data->paymentType));
      } catch (DomainException $e)
      {
         throw new InvalidDataException('Invalid payment type.');
      }
      $transaction->removeUnits();
      /** @var stdClass $unitData */
      foreach ($data->units as $unitData)
      {
         $unit = new Unit();
         $unit->setAmount($unitData->amount);
         $seller = $this->sellerRepo->find($unitData->sellerId);
         if ($seller === null)
         {
            throw new InvalidDataException('Seller not found.');
         }
         if (!$seller->isActive())
         {
            throw new InvalidDataException('Seller is not active.');
         }
         $unit->setSeller($seller);
         $transaction->addUnit($unit);
         $this->em->persist($unit);
      }
   }
}
