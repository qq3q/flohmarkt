<?php

namespace App\Tests\Util;

use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

abstract class AppKernelTestCase extends KernelTestCase
{
   private ?EntityManagerInterface $em;

   protected function setUp(): void
   {
      parent::setUp();
      static::bootKernel();
      $this->em = static::$kernel->getContainer()
         ->get('doctrine')
         ->getManager();
   }

   protected function tearDown(): void
   {
      parent::tearDown();

      // doing this is recommended to avoid memory leaks
      $this->em->close();
      $this->em = null;
   }

   protected function getEntityManager(): EntityManagerInterface {
      if( $this->em === null ) {
         throw new RuntimeException( 'EntityManager is not set. Method setUp() was not called?');
      }

      return $this->em;
   }
}