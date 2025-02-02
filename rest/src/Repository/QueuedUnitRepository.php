<?php

namespace App\Repository;

use App\Entity\QueuedUnit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<QueuedUnit>
 */
class QueuedUnitRepository extends ServiceEntityRepository
{
   public function __construct(ManagerRegistry $registry)
   {
      parent::__construct($registry, QueuedUnit::class);
   }

   /**
    * @return QueuedUnit[]
    */
   public function findByUserId(int $userId): array
   {
      return $this->findBy(['userId' => $userId]);
   }
}
