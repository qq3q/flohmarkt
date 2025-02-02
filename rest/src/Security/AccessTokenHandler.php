<?php

namespace App\Security;

use App\Repository\AccessTokenRepository;
use DateMalformedStringException;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

readonly class AccessTokenHandler implements AccessTokenHandlerInterface
{
   public function __construct(
      private AccessTokenRepository $repository,
   )
   {
   }

   /**
    * @throws DateMalformedStringException
    */
   public function getUserBadgeFrom(string $accessToken): UserBadge
   {
      $accessToken = $this->repository->findOneByToken($accessToken);
      if (null === $accessToken || !$accessToken->isValid())
      {
         throw new BadCredentialsException('Invalid credentials.');
      }

      return new UserBadge($accessToken->getUsername());
   }
}
