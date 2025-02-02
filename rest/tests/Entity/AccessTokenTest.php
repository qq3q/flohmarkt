<?php

namespace App\Tests\Entity;

use App\Entity\AccessToken;
use DateMalformedStringException;
use DateTimeImmutable;
use PHPUnit\Framework\TestCase;
use ReflectionClass;

class AccessTokenTest extends TestCase
{
   /**
    * @throws DateMalformedStringException
    */
   public function testIsValidReturnsTrueWhenCreatedAtIsWithinExpirationTime(): void
   {
      $accessToken = new AccessToken();

      $this->assertTrue($accessToken->isValid());
   }

   /**
    * @throws DateMalformedStringException
    */
   public function testIsValidReturnsFalseWhenCreatedAtIsOutsideExpirationTime(): void
   {
      $accessToken = new AccessToken();

      $reflection        = new ReflectionClass(AccessToken::class);
      $createdAtProperty = $reflection->getProperty('createdAt');
      $createdAtProperty->setValue($accessToken, (new DateTimeImmutable())->modify('-3700 seconds'));

      $this->assertFalse($accessToken->isValid());
   }
}
