<?php

namespace App\Repository;

use App\Entity\QueuedUnit;
use App\Entity\User;
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

   //    /**
   //     * @return Queue[] Returns an array of Queue objects
   //     */
   //    public function findByExampleField($value): array
   //    {
   //        return $this->createQueryBuilder('q')
   //            ->andWhere('q.exampleField = :val')
   //            ->setParameter('val', $value)
   //            ->orderBy('q.id', 'ASC')
   //            ->setMaxResults(10)
   //            ->getQuery()
   //            ->getResult()
   //        ;
   //    }

   //    public function findOneBySomeField($value): ?Queue
   //    {
   //        return $this->createQueryBuilder('q')
   //            ->andWhere('q.exampleField = :val')
   //            ->setParameter('val', $value)
   //            ->getQuery()
   //            ->getOneOrNullResult()
   //        ;
   //    }
}
