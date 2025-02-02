<?php

namespace App\Tests\Security;

use App\Entity\AccessToken;
use App\Repository\AccessTokenRepository;
use App\Security\AccessTokenHandler;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class AccessTokenHandlerTest extends TestCase
{
   private AccessTokenRepository $repository;
   private AccessTokenHandler    $sut;

   protected function setUp(): void
   {
      $this->repository = $this->createMock(AccessTokenRepository::class);
      $this->sut        = new AccessTokenHandler($this->repository);
   }

   public function testGetUserBadgeFromWithValidToken(): void
   {
      $validToken  = 'validToken';
      $username    = 'testUser';
      $accessToken = $this->createMock(AccessToken::class);

      $accessToken->expects($this->once())
         ->method('isValid')
         ->willReturn(true);

      $accessToken->expects($this->once())
         ->method('getUsername')
         ->willReturn($username);

      $this->repository->expects($this->once())
         ->method('findOneByToken')
         ->with($validToken)
         ->willReturn($accessToken);

      $userBadge = $this->sut->getUserBadgeFrom($validToken);

      $this->assertInstanceOf(UserBadge::class, $userBadge);
      $this->assertSame($username, $userBadge->getUserIdentifier());
   }

   public function testGetUserBadgeFromWithNullToken(): void
   {
      $invalidToken = 'invalidToken';

      $this->repository->expects($this->once())
         ->method('findOneByToken')
         ->with($invalidToken)
         ->willReturn(null);

      $this->expectException(BadCredentialsException::class);
      $this->expectExceptionMessage('Invalid credentials.');

      $this->sut->getUserBadgeFrom($invalidToken);
   }

   public function testGetUserBadgeFromWithExpiredOrInvalidAccessToken(): void
   {
      $invalidToken = 'expiredToken';
      $accessToken  = $this->createMock(AccessToken::class);

      $accessToken->expects($this->once())
         ->method('isValid')
         ->willReturn(false);

      $this->repository->expects($this->once())
         ->method('findOneByToken')
         ->with($invalidToken)
         ->willReturn($accessToken);

      $this->expectException(BadCredentialsException::class);
      $this->expectExceptionMessage('Invalid credentials.');

      $this->sut->getUserBadgeFrom($invalidToken);
   }
}
