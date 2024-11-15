<?php

namespace App\Repository;

use App\Entity\AccessToken;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AccessToken>
 */
class AccessTokenRepository extends ServiceEntityRepository
{
   public function __construct(ManagerRegistry $registry)
   {
      parent::__construct($registry, AccessToken::class);
   }

   //    /**
   //     * @return AccessToken[] Returns an array of AccessToken objects
   //     */
   //    public function findByExampleField($value): array
   //    {
   //        return $this->createQueryBuilder('a')
   //            ->andWhere('a.exampleField = :val')
   //            ->setParameter('val', $value)
   //            ->orderBy('a.id', 'ASC')
   //            ->setMaxResults(10)
   //            ->getQuery()
   //            ->getResult()
   //        ;
   //    }

   public function findOneByToken(string $token): ?AccessToken
   {
      return $this->findOneBy(['token' => $token]);
   }

   public function removeUserTokens(string $username): void {

      $this->createQueryBuilder('a')
         ->delete()
         ->where('a.username = :username')
         ->setParameter('username', $username)
         ->getQuery()
         ->execute();
   }
}
