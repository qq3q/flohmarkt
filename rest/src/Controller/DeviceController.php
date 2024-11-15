<?php

namespace App\Controller;

use App\Entity\QueuedUnit;
use App\Repository\QueuedUnitRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DeviceController extends AbstractController
{
   #[Route('/queued-unit', name: 'device_create_queued_unit', methods: ['POST'])]
   public function createQueuedUnit(Request $request, EntityManagerInterface $em, UserRepository $repo): Response
   {
      $data = json_decode($request->getContent());
      // @todo extract
      $token = $data->token;
      $user = $repo->findOneByDeviceToken($token);
      if(!$user) {

         return new Response('', Response::HTTP_NOT_FOUND);
      }

      $queuedUnit = new QueuedUnit();
      $queuedUnit
         ->setUserId($user->getId())
         ->setSellerId($data->sellerId)
         ->setAmount($data->amount);

      $em->persist($queuedUnit);
      $em->flush();

      return new Response('', Response::HTTP_CREATED);
   }

   #[Route('/queued-units/{token}', name: 'device_get_queued_units', methods: ['GET'])]
   public function getQueuedUnits(string $token, UserRepository $userRepo, QueuedUnitRepository $unitRepo): Response {
      $user = $userRepo->findOneByDeviceToken($token);
      if(!$user) {

         return new Response('', Response::HTTP_NOT_FOUND);
      }
      $units = $unitRepo->findByUserId($user->getId());

      $data = array_map(function(QueuedUnit $unit) {
         return [
            'sellerId' => $unit->getSellerId(),
            'amount' => $unit->getAmount()
         ];
      }, $units);

      return $this->json($data);
   }
}
