<?php

namespace App\Tests\Repository;

use App\Entity\Event;
use App\Repository\EventRepository;
use App\Tests\Util\AppKernelTestCase;

class EventRepositoryTest extends AppKernelTestCase
{
   private ?EventRepository $sut;

   protected function setUp(): void
   {
      parent::setUp();
      $this->sut = self::getContainer()->get(EventRepository::class);

      // make all existing events inactive
      $events = $this->sut->findAll();
      foreach ($events as $event)
      {
         $event->setActive(false);
      }
      $this->getEntityManager()->flush();
   }

   public function testFindActiveEventReturnsActiveEvent(): void
   {
      $event1 = (new Event())
         ->setTitle('event 1')
         ->setActive(false);
      $this->getEntityManager()->persist($event1);
      $event2 = (new Event())
         ->setTitle('event 2')
         ->setActive(true);
      $this->getEntityManager()->persist($event2);
      $this->getEntityManager()->flush();
      $activeEvent = $this->sut->findActiveEvent();
      $this->assertInstanceOf(Event::class, $activeEvent);
      $this->assertSame('event 2', $activeEvent->getTitle());
   }

   public function testFindActiveEventReturnsFirstActiveEvent(): void
   {
      $event1 = (new Event())
         ->setTitle('event 1')
         ->setActive(true);
      $this->getEntityManager()->persist($event1);
      $event2 = (new Event())
         ->setTitle('event 2')
         ->setActive(true);
      $this->getEntityManager()->persist($event2);
      $this->getEntityManager()->flush();
      $activeEvent = $this->sut->findActiveEvent();
      $this->assertInstanceOf(Event::class, $activeEvent);
      $this->assertSame('event 1', $activeEvent->getTitle());
   }

   public function testFindActiveEventReturnsNullIfNoActiveEventExists(): void
   {
      $event1 = (new Event())
         ->setTitle('event 1')
         ->setActive(false);
      $this->getEntityManager()->persist($event1);
      $event2 = (new Event())
         ->setTitle('event 2')
         ->setActive(false);
      $this->getEntityManager()->persist($event2);
      $this->getEntityManager()->flush();
      $this->assertNull($this->sut->findActiveEvent());
   }
}