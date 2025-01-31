<?php

namespace App\Service;

use App\Entity\Transaction;
use App\Entity\Unit;
use App\Enum\PaymentType;
use App\Exception\InvalidDataException;
use App\Repository\EventRepository;
use App\Repository\SellerRepository;
use Doctrine\ORM\EntityManagerInterface;
use DomainException;
use stdClass;
use UnexpectedValueException;

readonly class TransactionService
{
   public function __construct(
      private EntityManagerInterface $em,
      private EventRepository        $eventRepo,
      private SellerRepository       $sellerRepo,
   )
   {
   }

   /**
    * @throws InvalidDataException
    * @throws UnexpectedValueException
    */
   public function add(mixed $data): Transaction
   {
      $event = $this->eventRepo->findActiveEvent();
      if ($event === null)
      {
         throw new UnexpectedValueException('No active event');
      }
      $transaction = new Transaction();
      $event->addTransaction($transaction);
      $this->setData($transaction, $data);
      $this->em->persist($transaction);
      $this->em->flush();

      return $transaction;
   }

   /**
    * @throws InvalidDataException
    */
   public function update(Transaction $transaction, mixed $data): void
   {
      $this->setData($transaction, $data);
      $this->em->persist($transaction);
      $this->em->flush();
   }

   /**
    * @throws InvalidDataException
    */
   private function setData(Transaction $transaction, mixed $data): void
   {
      try {
         $transaction->setPaymentType(PaymentType::toEnum($data->paymentType));
      }
      catch (DomainException $e) {

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