<?php

namespace App\Service;

use App\Entity\QueuedUnit;
use App\Entity\User;
use App\Exception\InvalidDataException;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use stdClass;
use TypeError;

readonly class AddQueuedUnitService
{
   public function __construct(
      private EntityManagerInterface $em,
   )
   {
   }

   /**
    * @throws InvalidDataException
    */
   public function add(stdClass $data): void
   {
      /** @var UserRepository $repo */
      $repo = $this->em->getRepository(User::class);
      $token = $data->token;
      $user = $repo->findOneByDeviceToken($token);
      if(!$user) {

         throw new InvalidDataException('Token not found.');
      }
      $queuedUnit = new QueuedUnit();
      try {
         $queuedUnit
            ->setUserId($user->getId())
            ->setSellerId($data->sellerId)
            ->setAmount($data->amount);
      }
      catch (TypeError $e) {

         throw new InvalidDataException($e->getMessage());
      }

      $this->em->persist($queuedUnit);
      $this->em->flush();
   }
}
