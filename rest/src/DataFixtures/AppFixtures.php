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
      $userAdmin      = new User();
      $hashedPassword = $this->passwordHasher->hashPassword($userAdmin, 'qwertz');
      $userAdmin
         ->setUsername('admin')
         ->setPassword($hashedPassword)
         ->setRoles(['ROLE_ADMIN']);
      $manager->persist($userAdmin);

      $userCashPoint1 = new User();
      $userCashPoint1
         ->setUsername('kasse1')
         ->setPassword($hashedPassword)
         ->setRoles(['ROLE_CASH_POINT'])
         ->setDeviceToken('token1');
      $manager->persist($userCashPoint1);

      $userCashPoint2 = new User();
      $userCashPoint2
         ->setUsername('kasse2')
         ->setPassword($hashedPassword)
         ->setRoles(['ROLE_CASH_POINT'])
         ->setDeviceToken('token2');
      $manager->persist($userCashPoint2);

      $event = new Event();
      $event
         ->setTitle('Test event')
         ->setDonationRate(0.1)
         ->setActive(true);
      $manager->persist($event);

      $sellerIds = [1, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
                    33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 46, 47, 48, 51, 53, 56, 59, 60, 64, 65, 66, 68, 70, 71,
                    72, 73, 74, 75, 77, 78, 79, 80, 81, 83, 85, 87, 88, 89, 91, 93, 94, 95, 97, 98, 100, 113, 125, 126];
      foreach ($sellerIds as $id)
      {
         $seller = new Seller();
         $seller
            ->setId($id)
            ->setActive(true);
         $manager->persist($seller);
      }

      $manager->flush();
   }
}
