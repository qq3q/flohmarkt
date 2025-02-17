<?php

namespace App\Formatter;

use App\Entity\Seller;

class SellerIdFormatter
{
   public function format(Seller $seller): int {
      $id = $seller->getId();
      if( $id === null) {

         throw new \DomainException('Seller id is null');
      }

      return $id;
   }

   /**
    * @param Seller[] $sellers
    *
    * @return int[]
    */
   public function formatArray(array $sellers): array {

      return array_map([$this, 'format'], $sellers);
   }
}
