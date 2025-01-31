<?php

namespace App\Controller;

use App\Entity\Transaction;
use App\Entity\User;
use App\Exception\InvalidDataException;
use App\Formatter\CashpointEventFormatter;
use App\Formatter\QueuedUnitFormatter;
use App\Formatter\SellerIdFormatter;
use App\Repository\EventRepository;
use App\Repository\QueuedUnitRepository;
use App\Repository\SellerRepository;
use App\Service\TransactionService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use UnexpectedValueException;

#[IsGranted('ROLE_CASH_POINT')]
class CashPointController extends AbstractController
{
   #[Route('/active-event', name: 'cash_point_get_active_event', methods: ['GET'])]
   public function getActiveEvent(CashpointEventFormatter $formatter, EventRepository $repo): JsonResponse|Response
   {
      $event = $repo->findActiveEvent();
      if ($event === null)
      {
         return new Response('Active event not found.', Response::HTTP_NOT_FOUND);
      }

      return $this->json($formatter->format($event));
   }

   #[Route('/seller-ids', name: 'cash_point_get_seller_ids', methods: ['GET'])]
   public function getSellerIds(SellerRepository $repo, SellerIdFormatter $formatter): JsonResponse
   {
      $sellers = $repo->findAllActiveSellers();

      return $this->json($formatter->formatArray($sellers));
   }

   #[Route('/transaction', name: 'cash_point_post_transaction', methods: ['POST'])]
   public function postTransaction(Request            $request,
                                   TransactionService $srv): Response
   {
      $data = json_decode($request->getContent());
      try
      {
         $transaction = $srv->add($data);

         return new Response($transaction->getId(), Response::HTTP_CREATED);
      } catch (InvalidDataException|UnexpectedValueException $e)
      {
         return new Response($e->getMessage(), Response::HTTP_BAD_REQUEST);
      }
   }

   #[Route('/transaction/{id}', name: 'cash_point_patch_transaction', methods: ['PATCH'])]
   public function patchTransaction(Request            $request,
                                    Transaction        $transaction,
                                    TransactionService $srv): Response
   {
      $data = json_decode($request->getContent());
      try
      {
         $srv->update($transaction, $data);

         return new Response(null, Response::HTTP_NO_CONTENT);
      } catch (InvalidDataException $e)
      {
         return new Response($e->getMessage(), Response::HTTP_BAD_REQUEST);
      }
   }

   #[Route('/transaction/{id}', name: 'cash_point_delete_transaction', methods: ['DELETE'])]
   public function deleteTransaction(Transaction            $transaction,
                                     EntityManagerInterface $em): Response
   {
      $em->remove($transaction);
      $em->flush();

      return new Response(null, Response::HTTP_NO_CONTENT);
   }

   #[Route('/fetch-user-queued-units', name: 'cash_point_fetch_user_queued_units', methods: ['DELETE'])]
   public function fetchUserQueuedUnits(QueuedUnitRepository $unitRepo, QueuedUnitFormatter $formatter): Response
   {
      $user = $this->getUser();
      if ($user === null)
      {
         return new Response('User not found', Response::HTTP_INTERNAL_SERVER_ERROR);
      }
      if (!($user instanceof User))
      {
         return new Response(
            'User is not instance of ' . User::class,
            Response::HTTP_INTERNAL_SERVER_ERROR);
      }

      $units = $unitRepo->clearByUserId($user->getId(), true);

      // @todo ignore units older than 30 seconds (or similar time)

      return $this->json($formatter->formatArray($units));
   }
}
