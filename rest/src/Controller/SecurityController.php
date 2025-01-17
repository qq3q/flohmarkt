<?php

namespace App\Controller;

use App\Entity\AccessToken;
use App\Entity\User;
use App\Repository\AccessTokenRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Role\RoleHierarchyInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class SecurityController extends AbstractController
{
   #[Route('/login', name: 'security_login', methods: ['POST'])]
   public function login(#[CurrentUser] ?User   $user,
                         AccessTokenRepository  $repo,
                         EntityManagerInterface $em): Response
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

      return new Response($token);
   }

   #[route('/user', name: 'security_user', methods: ['GET'])]
   #[IsGranted('ROLE_USER')]
   public function user(#[CurrentUser] ?User $user, RoleHierarchyInterface $roleHierarchy): JsonResponse
   {
      return $this->json([
         'name'  => $user->getUserIdentifier(),
         'roles' => $roleHierarchy->getReachableRoleNames($user->getRoles()),
      ]);
   }

   #[Route('/logout', name: 'security_logout', methods: ['GET'])]
   public function logout(#[CurrentUser] ?User   $user,
                          Security               $security,
                          AccessTokenRepository  $repo,
                          EntityManagerInterface $em): Response
   {
      if (null === $user)
      {
         return $this->json([
            'message' => 'You are not logged in.',
         ], Response::HTTP_UNAUTHORIZED);
      }
      $repo->removeUserTokens($user->getUsername());
      $em->flush();
      $security->logout(false);

      return new Response('', Response::HTTP_NO_CONTENT);
   }
}
