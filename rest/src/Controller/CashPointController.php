<?php

namespace App\Controller;

use App\Entity\QueuedUnit;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_CASH_POINT')]
class CashPointController extends AbstractController
{
   #[Route('/transactions', name: 'cash_point_transactions', methods: ['GET'])]
   public function transactions(Request $request, EntityManagerInterface $em): JsonResponse
   {
      // return all transactions with containing units
      return $this->json([
         [
            'id' => 1
         ],
      ]);
   }
}
