<?php

namespace App\Tests\Service;

use App\Entity\QueuedUnit;
use App\Entity\User;
use App\Exception\InvalidDataException;
use App\Service\AddQueuedUnitService;
use App\Tests\Util\AppKernelTestCase;

class AddQueuedUnitServiceTest extends AppKernelTestCase
{
   private string                $token = 'test_token_3409dsf';
   private ?User                 $user;
   private ?AddQueuedUnitService $sut;

   protected function setUp(): void
   {
      parent::setUp();
      $this->sut = self::getContainer()->get(AddQueuedUnitService::class);
      $this->user = new User();
      $this->user
         ->setUsername('test123')
         ->setPassword('PASSWORD')
         ->setRoles(['ROLE_USER'])
         ->setDeviceToken($this->token);
      $this->getEntityManager()->persist($this->user);
      $this->getEntityManager()->flush();
   }

   /**
    * @throws InvalidDataException
    */
   public function testValidData(): void
   {
      $em = $this->getEntityManager();
      $oldUnits = $em->getRepository(QueuedUnit::class)->findAll();
      $data     = (object)[
         'token'    => $this->token,
         'sellerId' => 1,
         'amount'   => 100.45
      ];
      $this->sut->add($data);

      /** @var QueuedUnit[] $units */
      $units = $em->getRepository(QueuedUnit::class)->findAll();
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
      $data = (object)[
         'token'    => 'UNKNOWN',
         'sellerId' => 1,
         'amount'   => 100.45
      ];
      $this->expectException(InvalidDataException::class);

      $this->sut->add($data);
   }

   /**
    * @throws InvalidDataException
    */
   public function testInvalidSellerId(): void
   {
      $data = (object)[
         'token'    => $this->token,
         'sellerId' => 'INVALID',
         'amount'   => 100.45
      ];
      $this->expectException(InvalidDataException::class);

      $this->sut->add($data);
   }

   /**
    * @throws InvalidDataException
    */
   public function testInvalidAmount(): void
   {
      $data = (object)[
         'token'    => $this->token,
         'sellerId' => 1,
         'amount'   => 'INVALID'
      ];
      $this->expectException(InvalidDataException::class);

      $this->sut->add($data);
   }
}
