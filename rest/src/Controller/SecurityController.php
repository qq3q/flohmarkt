<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\AccessTokenService;
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
   public function login(#[CurrentUser] ?User $user,
                         AccessTokenService   $srv): Response
   {
      if (null === $user)
      {
         return $this->json([
            'message' => 'missing credentials',
         ], Response::HTTP_UNAUTHORIZED);
      }
      $token = $srv->renew($user->getUsername());

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
   public function logout(#[CurrentUser] ?User $user,
                          Security             $security,
                          AccessTokenService   $srv): Response
   {
      if (null === $user)
      {
         return new Response('You are not logged in.', Response::HTTP_UNAUTHORIZED);
      }
      $srv->remove($user->getUsername());
      $security->logout(false);

      return new Response('', Response::HTTP_NO_CONTENT);
   }
}
