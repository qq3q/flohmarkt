<?php

namespace App\DataFixtures;

use App\Entity\Event;
use App\Entity\Seller;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
   public function __construct(
      private readonly UserPasswordHasherInterface $passwordHasher)
   {
   }

   public function load(ObjectManager $manager): void
   {
      $user = new User();
      $hashedPassword = $this->passwordHasher->hashPassword($user, 'qwertz');
      $user
         ->setUsername('admin')
         ->setPassword($hashedPassword)
         ->setRoles(['ROLE_ADMIN'])
         ->setDeviceToken('test_device_token');
      $manager->persist($user);

      $event = new Event();
      $event
         ->setTitle('Test event')
         ->setDonationRate(0.1)
         ->setActive(true);
      $manager->persist($event);

      $seller1 = new Seller();
      $seller1
         ->setId(1)
         ->setActive(true);
      $manager->persist($seller1);

      $seller2 = new Seller();
      $seller2
         ->setId(2)
         ->setActive(true);
      $manager->persist($seller2);

      $seller3 = new Seller();
      $seller3
         ->setId(3)
         ->setActive(true);
      $manager->persist($seller3);

      $manager->flush();
   }
}
