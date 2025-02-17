<?php

namespace App\Tests\Entity;

use App\Entity\AccessToken;
use DateMalformedStringException;
use DateTimeImmutable;
use PHPUnit\Framework\TestCase;
use ReflectionClass;

class AccessTokenTest extends TestCase
{
   private AccessToken $accessToken;

   protected function setUp(): void
   {
      parent::setUp();
      $this->accessToken = new AccessToken();
   }

   /**
    * @throws DateMalformedStringException
    */
   public function testIsValidReturnsTrueWhenCreatedAtIsWithinExpirationTime(): void
   {
      $this->assertTrue($this->accessToken->isValid());
   }

   /**
    * @throws DateMalformedStringException
    * @dataProvider isValidProvider
    */
   public function testIsValid(int $modifySecondsCreate, int $modifySecondsTouch, bool $shouldBeValid): void
   {
      $reflection        = new ReflectionClass(AccessToken::class);
      $createdAtProperty = $reflection->getProperty('createdAt');
      $createdAtProperty->setValue(
         $this->accessToken,
         $this->createCompareTime($modifySecondsCreate)
      );
      $touchedAtProperty = $reflection->getProperty('touchedAt');
      $touchedAtProperty->setValue(
         $this->accessToken,
         $this->createCompareTime($modifySecondsTouch)
      );

      $this->assertSame($shouldBeValid, $this->accessToken->isValid());
   }

   private function isValidProvider(): array
   {
      return [
         'created and touched time are just not expired'  => [
            -AccessToken::EXPIRATION_TIME_CREATE + 1,
            -AccessToken::EXPIRATION_TIME_TOUCH + 1,
            true
         ],
         'created time is just expired'                   => [
            -AccessToken::EXPIRATION_TIME_CREATE,
            -AccessToken::EXPIRATION_TIME_TOUCH + 1,
            false
         ],
         'touched time is just expired'                   => [
            -AccessToken::EXPIRATION_TIME_CREATE + 1,
            -AccessToken::EXPIRATION_TIME_TOUCH,
            false
         ],
         'created time and touched time are just expired' => [
            -AccessToken::EXPIRATION_TIME_CREATE,
            -AccessToken::EXPIRATION_TIME_TOUCH,
            false
         ]
      ];
   }

   /**
    * @throws DateMalformedStringException
    */
   private function createCompareTime(int $modifySeconds): \DateTimeImmutable
   {
      return (new DateTimeImmutable())->modify(sprintf('-%d seconds', $modifySeconds));
   }
}
