<?php

namespace App\Entity;

use App\Repository\AccessTokenRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AccessTokenRepository::class)]
class AccessToken
{
   #[ORM\Id]
   #[ORM\GeneratedValue]
   #[ORM\Column]
   private ?int $id = null;
   #[ORM\Column(length: 255)]
   private ?string $token = null;
   #[ORM\Column]
   private ?bool $valid = null;
   #[ORM\Column]
   private \DateTimeImmutable $createdAt;
   #[ORM\Column]
   private ?string $username = null;

   public function __construct()
   {
      $this->createdAt = new \DateTimeImmutable();
   }

   public function getId(): ?int
   {
      return $this->id;
   }

   public function getToken(): ?string
   {
      return $this->token;
   }

   public function setToken(string $token): static
   {
      $this->token = $token;

      return $this;
   }

   public function isValid(): ?bool
   {
      return $this->valid;
   }

   public function setValid(bool $valid): static
   {
      $this->valid = $valid;

      return $this;
   }

   public function getCreatedAt(): \DateTimeImmutable
   {
      return $this->createdAt;
   }

   public function getUsername(): ?string
   {
      return $this->username;
   }

   public function setUsername(?string $username): static
   {
      $this->username = $username;

      return $this;
   }
}
