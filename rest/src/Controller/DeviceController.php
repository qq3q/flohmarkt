<?php

namespace App\Controller;

use App\Exception\InvalidDataException;
use App\Service\AddQueuedUnitService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DeviceController extends AbstractController
{
   #[Route('/queued-unit', name: 'device_create_queued_unit', methods: ['POST'])]
   public function createQueuedUnit(Request $request, AddQueuedUnitService $srv): Response
   {
      $data = json_decode($request->getContent());
      try
      {
         $srv->add($data);

         return new Response('', Response::HTTP_CREATED);
      } catch (InvalidDataException $e)
      {
         return new Response($e->getMessage(), Response::HTTP_BAD_REQUEST);
      }
   }
}
