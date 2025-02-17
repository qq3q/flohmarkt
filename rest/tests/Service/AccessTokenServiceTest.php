<?php

namespace App\Tests\Service;

use App\Entity\AccessToken;
use App\Exception\InvalidDataException;
use App\Service\AccessTokenService;
use App\Tests\Util\AppKernelTestCase;

class AccessTokenServiceTest extends AppKernelTestCase
{
   private AccessTokenService $sut;

   protected function setUp(): void
   {
      parent::setUp();
      $this->sut = self::getContainer()->get(AccessTokenService::class);
   }

   /**
    * @throws InvalidDataException
    */
   public function testRenew_NoTokensExistsForUser(): void
   {
      $token = $this->sut->renew('USERNAME');
      $this->assertIsString($token);
      $this->assertSame(32, strlen($token));

      /** @var AccessToken[] $tokens */
      $accessTokens = $this->getEntityManager()->getRepository(AccessToken::class)->findAll();
      $this->assertCount(1, $accessTokens);
      $accessToken = array_pop($accessTokens);
      $this->assertSame('USERNAME', $accessToken->getUsername());;
      $this->assertSame($token, $accessToken->getToken());
   }

   public function testRenew_TokensExistsForUser(): void
   {
      $existingAccessToken = (new AccessToken())
         ->setUsername('USERNAME')
         ->setToken('0123456789012345678912');
      $this->getEntityManager()->persist($existingAccessToken);
      $this->getEntityManager()->flush();

      $token = $this->sut->renew('USERNAME');
      $this->assertIsString($token);
      $this->assertSame(32, strlen($token));

      /** @var AccessToken[] $tokens */
      $accessTokens = $this->getEntityManager()->getRepository(AccessToken::class)->findAll();
      $this->assertCount(1, $accessTokens);
   }

   public function testRemove(): void
   {
      $existingAccessToken1 = (new AccessToken())
         ->setUsername('USERNAME1')
         ->setToken('0123456789012345678912');
      $this->getEntityManager()->persist($existingAccessToken1);
      $existingAccessToken2 = (new AccessToken())
         ->setUsername('USERNAME2')
         ->setToken('0123456789012345678912');
      $this->getEntityManager()->persist($existingAccessToken2);
      $this->getEntityManager()->flush();

      $this->sut->remove('USERNAME1');

      /** @var AccessToken[] $tokens */
      $accessTokens = $this->getEntityManager()->getRepository(AccessToken::class)->findAll();
      foreach ($accessTokens as $token) {
         $this->assertNotEquals('USERNAME1', $token->getUsername());
      }
   }
}
