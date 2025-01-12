<?php

namespace App\Repository;

use App\Entity\QueuedUnit;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\UserInterface;

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

   /**
    * @return QueuedUnit[]
    */
   public function clearByUserId(int $userId, bool $doFlush = false): array {
      $units = $this->findByUserId($userId);
      foreach ($units as $unit) {
         $this->getEntityManager()->remove($unit);
      }
      if($doFlush) {
         $this->getEntityManager()->flush();
      }

      return $units;
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
