<?php

namespace App\Tests\Repository;

use App\Entity\Seller;
use App\Repository\SellerRepository;
use App\Tests\Util\AppKernelTestCase;

class SellerRepositoryTest extends AppKernelTestCase
{
   private ?SellerRepository $sut;

   protected function setUp(): void
   {
      parent::setUp();
      $this->sut = self::getContainer()->get(SellerRepository::class);

      // make all existing sellers inactive
      $sellers = $this->sut->findAll();
      foreach ($sellers as $seller)
      {
         $seller->setActive(false);
      }
      $this->getEntityManager()->flush();
   }

   public function testFindActiveSellersReturnsActiveSellers(): void
   {
      $seller1 = (new Seller())
         ->setId(-1)
         ->setActive(false);
      $this->getEntityManager()->persist($seller1);
      $seller1 = (new Seller())
         ->setId(-2)
         ->setActive(true);
      $this->getEntityManager()->persist($seller1);
      $seller1 = (new Seller())
         ->setId(-3)
         ->setActive(true);
      $this->getEntityManager()->persist($seller1);
      $seller1 = (new Seller())
         ->setId(-4)
         ->setActive(false);
      $this->getEntityManager()->persist($seller1);

      $this->getEntityManager()->flush();
      $activeSellers = $this->sut->findAllActiveSellers();
      $this->assertCount(2, $activeSellers);
      $this->assertContains($activeSellers[0]->getId(), [-2, -3]);
   }
}
