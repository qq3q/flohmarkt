<?php

namespace App\Service;

use App\Entity\AccessToken;
use App\Repository\AccessTokenRepository;
use Doctrine\ORM\EntityManagerInterface;

readonly class AccessTokenService
{
   public function __construct(
      private AccessTokenRepository  $repo,
      private EntityManagerInterface $em
   )
   {
   }

   public function renew(string $username): string
   {
      $this->repo->removeUserTokens($username);
      $accessToken = new AccessToken();
      $token       = md5(uniqid());
      $accessToken
         ->setUsername($username)
         ->setToken($token);
      $this->em->persist($accessToken);
      $this->em->flush();

      return $token;
   }

   public function remove(string $username): void {
      $this->repo->removeUserTokens($username);
      $this->em->flush();
   }
}
