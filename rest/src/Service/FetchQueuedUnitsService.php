<?php

namespace App\Service;

use App\Repository\QueuedUnitRepository;
use DateMalformedStringException;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;

readonly class FetchQueuedUnitsService
{
   private const EXPIRATION_TIME = 30; // seconds

   public function __construct(
      private QueuedUnitRepository   $repo,
      private EntityManagerInterface $em,
   )
   {
   }

   /**
    * @throws DateMalformedStringException
    */
   public function fetch(int $userId): array
   {
      $units = $this->repo->findByUserId($userId);
      foreach ($units as $unit)
      {
         $this->em->remove($unit);
      }
      $this->em->flush();

      $compareTime = (new DateTimeImmutable())
         ->modify(sprintf('-%s seconds', self::EXPIRATION_TIME));

      return array_filter($units, function ($unit) use ($compareTime) {
         return $unit->getCreatedAt() > $compareTime;
      });
   }
}
