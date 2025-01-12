<?php

namespace App\Formatter;

use App\Entity\Event;
use App\Entity\Transaction;
use App\Entity\Unit;

class CashpointEventFormatter
{
   public function format(Event $event): array
   {
      return [
         'title'        => $event->getTitle(),
         'donationRate' => $event->getDonationRate(),
         'transactions' => array_map([$this, 'formatTransaction'], $event->getTransactions()->toArray()),
      ];
   }

   private function formatTransaction(Transaction $transaction): array
   {
      $units = $transaction->getUnitsOfActiveSellers();

      return [
         'id'          => $transaction->getId(),
         'createdAt'   => $transaction->getCreatedAt()->format('Y-m-d H:i:s'),
         'paymentType' => $transaction->getPaymentType()->value,
         'units'       => array_map([$this, 'formatUnit'], $units->toArray()),
      ];
   }

   private function formatUnit(Unit $unit): array
   {
      return [
         'id'       => $unit->getId(),
         'amount'   => $unit->getAmount(),
         'sellerId' => $unit->getSeller()->getId()
      ];
   }
}