<?php

namespace App\Controller;

use App\Entity\AccessToken;
use App\Entity\User;
use App\Repository\AccessTokenRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class SecurityController extends AbstractController
{
   #[Route('/login', name: 'security_login', methods: ['POST'])]
   public function login(#[CurrentUser] ?User $user, AccessTokenRepository $repo, EntityManagerInterface $em): JsonResponse
   {
      if (null === $user)
      {
         return $this->json([
            'message' => 'missing credentials',
         ], Response::HTTP_UNAUTHORIZED);
      }

      // @todo extract
      $repo->removeUserTokens($user->getUsername());
      $accessToken = new AccessToken();
      $token       = md5(uniqid());
      $accessToken
         ->setUsername($user->getUsername())
         ->setToken($token)
         ->setValid(true);
      $em->persist($accessToken);
      $em->flush();

      return $this->json([
         'user'  => $user->getUserIdentifier(),
         'token' => $token,
      ]);
   }
}
