<?php

namespace App\Entity;

use App\Repository\AccessTokenRepository;
use DateMalformedStringException;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AccessTokenRepository::class)]
class AccessToken
{
   public const EXPIRATION_TIME_CREATE = 10 * 24 * 3600; // 10 days in seconds
   public const EXPIRATION_TIME_TOUCH = 1800; // a half hour in seconds

   #[ORM\Id]
   #[ORM\GeneratedValue]
   #[ORM\Column]
   private ?int $id = null;
   #[ORM\Column(length: 255)]
   private ?string $token = null;
   #[ORM\Column]
   private \DateTimeImmutable $createdAt;
   #[ORM\Column]
   private \DateTimeImmutable $touchedAt;
   #[ORM\Column]
   private ?string $username = null;

   public function __construct()
   {
      $this->createdAt = new \DateTimeImmutable();
      $this->touchedAt = new \DateTimeImmutable();
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

   /**
    * @throws DateMalformedStringException
    */
   public function isValid(): bool
   {
      $compareTime = (new DateTimeImmutable())
         ->modify(sprintf('-%s seconds', self::EXPIRATION_TIME_TOUCH));

      if($this->getTouchedAt() < $compareTime) {

         return false;
      }

      $compareTime = (new DateTimeImmutable())
         ->modify(sprintf('-%s seconds', self::EXPIRATION_TIME_CREATE));

      return $this->getCreatedAt() >= $compareTime;
   }

   public function getCreatedAt(): \DateTimeImmutable
   {
      return $this->createdAt;
   }

   public function getTouchedAt(): DateTimeImmutable
   {
      return $this->touchedAt;
   }

   public function touch(): static {
      $this->touchedAt = new \DateTimeImmutable();

      return $this;
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
