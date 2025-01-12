<?php

namespace App\Formatter;

use App\Entity\QueuedUnit;

class QueuedUnitFormatter
{
   public function format(QueuedUnit $unit): array
   {

      return [
         'sellerId' => $unit->getSellerId(),
         'amount' => $unit->getAmount(),
      ];
   }

   /**
    * @param QueuedUnit[] $units
    */
   public function formatArray(array $units): array
   {
      return array_map([$this, 'format'], $units);
   }
}
