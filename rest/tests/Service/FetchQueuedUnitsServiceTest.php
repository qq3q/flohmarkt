<?php

namespace App\Tests\Service;

use App\Entity\QueuedUnit;
use App\Repository\QueuedUnitRepository;
use App\Service\FetchQueuedUnitsService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class FetchQueuedUnitsServiceTest extends TestCase
{
   private FetchQueuedUnitsService $service;
   private QueuedUnitRepository    $repoMock;
   private EntityManagerInterface  $emMock;

   protected function setUp(): void
   {
      $this->repoMock = $this->createMock(QueuedUnitRepository::class);
      $this->emMock   = $this->createMock(EntityManagerInterface::class);
      $this->service  = new FetchQueuedUnitsService($this->repoMock, $this->emMock);
   }

   public function testFetchRemovesUnitsAndReturnsNonExpiredUnits(): void
   {
      $userId = 1;

      $expiredUnit = $this->createMock(QueuedUnit::class);
      $expiredUnit->method('getCreatedAt')->willReturn(
         new \DateTimeImmutable('-40 seconds')
      );

      $validUnit = $this->createMock(QueuedUnit::class);
      $validUnit->method('getCreatedAt')->willReturn(
         new \DateTimeImmutable('-20 seconds')
      );

      $this->repoMock
         ->method('findByUserId')
         ->with($userId)
         ->willReturn([$expiredUnit, $validUnit]);

      $this->emMock
         ->expects($this->exactly(2))
         ->method('remove')
         ->withConsecutive([$expiredUnit], [$validUnit]);

      $this->emMock
         ->expects($this->once())
         ->method('flush');

      $result = $this->service->fetch($userId);

      $this->assertCount(1, $result);
      $unit = array_shift($result);
      $this->assertSame($validUnit, $unit);
   }

   public function testFetchWithNoUnitsFound(): void
   {
      $userId = 1;

      $this->repoMock
         ->method('findByUserId')
         ->with($userId)
         ->willReturn([]);

      $this->emMock
         ->expects($this->never())
         ->method('remove');

      $this->emMock
         ->expects($this->once())
         ->method('flush');

      $result = $this->service->fetch($userId);

      $this->assertCount(0, $result);
   }
}
