<?php

namespace App\Tests\Entity;

use App\Entity\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
   public function testGetRolesReturnsDefaultRole(): void
   {
      $user = new User();

      $roles = $user->getRoles();

      $this->assertEquals(['ROLE_USER'], $roles);
   }

   public function testGetRolesReturnsAssignedRoles(): void
   {
      $user = new User();
      $user->setRoles(['ROLE_ADMIN']);

      $roles = $user->getRoles();

      $this->assertEquals(['ROLE_ADMIN', 'ROLE_USER'], $roles);
   }

   public function testGetRolesEnsuresRolesAreUnique(): void
   {
      $user = new User();
      $user->setRoles(['ROLE_ADMIN', 'ROLE_ADMIN']);

      $roles = $user->getRoles();

      $this->assertEquals(['0' => 'ROLE_ADMIN', '2' => 'ROLE_USER'], $roles);
   }

   public function testGetRolesDoesNotDuplicateDefaultRole(): void
   {
      $user = new User();
      $user->setRoles(['ROLE_USER']);

      $roles = $user->getRoles();

      $this->assertEquals(['ROLE_USER'], $roles);
   }
}
