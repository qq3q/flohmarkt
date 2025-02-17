<?php

namespace App\Entity;

use App\Repository\QueuedUnitRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QueuedUnitRepository::class)]
class QueuedUnit
{
   #[ORM\Id]
   #[ORM\GeneratedValue]
   #[ORM\Column]
   private ?int               $id       = null;
   #[ORM\Column]
   private \DateTimeImmutable $createdAt;
   #[ORM\Column]
   private ?int               $sellerId = null;
   #[ORM\Column]
   private ?float             $amount   = null;
   #[ORM\Column]
   private ?int               $userId;

   public function __construct()
   {
      $this->createdAt = new \DateTimeImmutable();
   }

   public function getId(): ?int
   {
      return $this->id;
   }

   public function getCreatedAt(): \DateTimeImmutable
   {
      return $this->createdAt;
   }

   public function getSellerId(): ?int
   {
      return $this->sellerId;
   }

   public function setSellerId(int $sellerId): static
   {
      $this->sellerId = $sellerId;

      return $this;
   }

   public function getAmount(): ?float
   {
      return $this->amount;
   }

   public function setAmount(float $amount): static
   {
      $this->amount = $amount;

      return $this;
   }

   public function getUserId(): ?int
   {
      return $this->userId;
   }

   public function setUserId(int $userId): static
   {
      $this->userId = $userId;

      return $this;
   }
}
