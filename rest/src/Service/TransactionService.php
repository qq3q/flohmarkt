<?php

namespace App\Service;

use App\Entity\Transaction;
use App\Entity\Unit;
use App\Enum\PaymentType;
use App\Repository\EventRepository;
use App\Repository\SellerRepository;
use Doctrine\ORM\EntityManagerInterface;

class TransactionService
{
   public function __construct(
      private readonly EntityManagerInterface $em,
      private readonly EventRepository $eventRepo,
      private readonly SellerRepository $sellerRepo,
   )
   {
   }

   // @todo use data class
   public function add(mixed $data): Transaction {
      $event = $this->eventRepo->findActiveEvent();
      if($event === null) {
         // @todo
         throw new \Exception('No active event');
      }
      $transaction = new Transaction();
      $event->addTransaction($transaction);
      $this->setData($transaction, $data);
      $this->em->persist($transaction);
      $this->em->flush();

      return $transaction;
   }

   // @todo use data class
   public function update(Transaction $transaction, mixed $data): void {
      $this->setData($transaction, $data);
      $this->em->persist($transaction);
      $this->em->flush();
   }

   private function setData(Transaction $transaction, mixed $data): void
   {
      $transaction->setPaymentType(PaymentType::toEnum($data->paymentType));
      $transaction->removeUnits();
      /** @var \stdClass $unitData */
      foreach ($data->units as $unitData)
      {
         $unit = new Unit();
         $unit->setAmount($unitData->amount);
         $seller = $this->sellerRepo->find($unitData->sellerId);
         if ($seller === null)
         {
            // @todo
            throw new \Exception('Seller not found');
         }
         if (!$seller->isActive())
         {
            throw new \Exception('Seller is not active');
         }
         $unit->setSeller($seller);
         $transaction->addUnit($unit);
         $this->em->persist($unit);
      }
   }
}