<?php

namespace App\Tests\Repository;

use App\Entity\AccessToken;
use App\Repository\AccessTokenRepository;
use App\Tests\Util\AppKernelTestCase;

class AccessTokenRepositoryTest extends AppKernelTestCase
{
   private ?AccessToken $accessToken1;
   private ?AccessToken $accessToken2;
   private ?AccessToken $accessToken3;
   private ?AccessTokenRepository $sut;

   protected function setUp(): void
   {
      parent::setUp();
      $this->sut = self::getContainer()->get(AccessTokenRepository::class);
      $this->accessToken1 = (new AccessToken())
         ->setToken('TOKEN1')
         ->setUsername('USERNAME1');
      $this->getEntityManager()->persist($this->accessToken1);
      $this->accessToken2 = (new AccessToken())
         ->setToken('TOKEN2')
         ->setUsername('USERNAME2');
      $this->getEntityManager()->persist($this->accessToken2);
      $this->accessToken3 = (new AccessToken())
         ->setToken('TOKEN2')
         ->setUsername('USERNAME1');
      $this->getEntityManager()->persist($this->accessToken3);
      $this->getEntityManager()->flush();
   }

   public function testFindOneByTokenReturnsExistingToken(): void
   {
      $accessToken = $this->sut->findOneByToken('TOKEN2');
      $this->assertSame($this->accessToken2, $accessToken);
   }

   public function testFindOneByTokenReturnsNullIfTokenNotsExists(): void
   {
      $accessToken = $this->sut->findOneByToken('UNKNOWN TOKEN');
      $this->assertNull($accessToken);
   }

   public function testRemoveUserTokens(): void
   {
      $this->sut->removeUserTokens('USERNAME1');
      /** @var AccessToken[] $accessTokens */
      $accessTokens = $this->sut->findAll();
      foreach ($accessTokens as $token) {
         $this->assertNotEquals('USERNAME1', $token->getUsername());
      }
   }
}
