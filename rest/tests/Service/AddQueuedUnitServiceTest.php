<?php

namespace App\Tests\Service;

use App\Entity\QueuedUnit;
use App\Entity\User;
use App\Exception\InvalidDataException;
use App\Service\AddQueuedUnitService;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use TypeError;

class AddQueuedUnitServiceTest extends KernelTestCase
{
   private string $token = 'test_token_3409dsf';
   private ?User $user;
   private ?EntityManager $em;
   private ?AddQueuedUnitService $sut;

   /**
    * @throws OptimisticLockException
    * @throws ORMException
    */
   protected function setUp(): void
   {
      parent::setUp();
      $kernel = self::bootKernel();
      $this->sut = $kernel->getContainer()->get(AddQueuedUnitService::class);
      $this->em = $kernel->getContainer()
         ->get('doctrine')
         ->getManager();

      $this->user = new User();
      $this->user
         ->setUsername('test123')
         ->setPassword('PASSWORD')
         ->setRoles(['ROLE_USER'])
         ->setDeviceToken($this->token);
      $this->em->persist($this->user);
      $this->em->flush();

   }
   protected function tearDown(): void
   {
      parent::tearDown();

      // doing this is recommended to avoid memory leaks
      $this->em->close();
      $this->em = null;
   }

   /**
    * @throws InvalidDataException
    */
   public function testValidData(): void
   {
      $oldUnits = $this->em->getRepository(QueuedUnit::class)->findAll();
      $data = (object) [
         'token' => $this->token,
         'sellerId' => 1,
         'amount' => 100.45
      ];
      $this->sut->add($data);

      /** @var QueuedUnit[] $units */
      $units = $this->em->getRepository(QueuedUnit::class)->findAll();
      $this->assertSame(count($oldUnits) + 1, count($units));

      $lastUnit = array_pop($units);
      $this->assertSame($this->user->getId(), $lastUnit->getUserId());
      $this->assertSame($data->sellerId, $lastUnit->getSellerId());
      $this->assertSame($data->amount, $lastUnit->getAmount());
   }

   /**
    * @throws InvalidDataException
    */
   public function testUnknownToken(): void
   {
      $data = (object) [
         'token' => 'UNKNOWN',
         'sellerId' => 1,
         'amount' => 100.45
      ];
      $this->expectException(InvalidDataException::class);

      $this->sut->add($data);
   }

   /**
    * @throws InvalidDataException
    */
   public function testInvalidSellerId(): void
   {
      $data = (object) [
         'token' => $this->token,
         'sellerId' => 'INVALID',
         'amount' => 100.45
      ];
      $this->expectException(InvalidDataException::class);

      $this->sut->add($data);
   }

   /**
    * @throws InvalidDataException
    */
   public function testInvalidAmount(): void
   {
      $data = (object) [
         'token' => $this->token,
         'sellerId' => 1,
         'amount' => 'INVALID'
      ];
      $this->expectException(InvalidDataException::class);

      $this->sut->add($data);
   }
}
