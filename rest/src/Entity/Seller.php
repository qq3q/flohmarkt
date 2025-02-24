<?php

namespace App\Entity;

use App\Repository\SellerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SellerRepository::class)]
class Seller
{
   #[ORM\Id]
   #[ORM\Column]
   private ?int $id = null;

   #[ORM\Column]
   private bool $active = false;
   /**
    * @var Collection<int, Unit>
    */
   #[ORM\OneToMany(targetEntity: Unit::class, mappedBy: 'seller', orphanRemoval: true)]
   private Collection $units;

   public function __construct()
   {
      $this->units = new ArrayCollection();
   }

   public function setId(int $id): static
   {
      $this->id = $id;

      return $this;
   }

   public function getId(): ?int
   {
      return $this->id;
   }

   public function isActive(): bool
   {
      return $this->active;
   }

   public function setActive(bool $active): static
   {
      $this->active = $active;

      return $this;
   }

   /**
    * @return Collection<int, Unit>
    */
   public function getUnits(): Collection
   {
      return $this->units;
   }
}
