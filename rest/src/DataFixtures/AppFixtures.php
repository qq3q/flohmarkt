<?php

namespace App\DataFixtures;

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
      $manager->flush();
   }
}
