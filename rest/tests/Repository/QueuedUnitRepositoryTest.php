<?php

namespace App\Tests\Repository;

use App\Entity\QueuedUnit;
use App\Entity\Seller;
use App\Entity\User;
use App\Repository\QueuedUnitRepository;
use App\Tests\Util\AppKernelTestCase;

class QueuedUnitRepositoryTest extends AppKernelTestCase
{
   private ?QueuedUnitRepository $sut;

   protected function setUp(): void
   {
      parent::setUp();
      $this->sut = self::getContainer()->get(QueuedUnitRepository::class);
   }

   public function testFindByUserId(): void
   {
      $user1 = (new User())
         ->setUsername('USERNAME1')
         ->setPassword('PASSWORD1');
      $this->getEntityManager()->persist($user1);
      $user2 = (new User())
         ->setUsername('USERNAME2')
         ->setPassword('PASSWORD2');
      $this->getEntityManager()->persist($user2);
      $seller = (new Seller())
         ->setId(-1);
      $this->getEntityManager()->flush();
      $this->getEntityManager()->persist($seller);
      $queuedUnit1 = (new QueuedUnit())
         ->setSellerId(-1)
         ->setAmount(100.45)
         ->setUserId($user1->getId());
      $this->getEntityManager()->persist($queuedUnit1);
      $queuedUnit2 = (new QueuedUnit())
         ->setSellerId(-1)
         ->setAmount(97.12)
         ->setUserId($user2->getId());
      $this->getEntityManager()->persist($queuedUnit2);
      $this->getEntityManager()->flush();

      $queuedUnits = $this->sut->findByUserId($user1->getId());
      $this->assertCount(1, $queuedUnits);
      $first = array_shift($queuedUnits);
      $this->assertSame($queuedUnit1, $first);
   }
}
