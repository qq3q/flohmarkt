<?php

namespace App\Entity;

use App\Enum\PaymentType;
use App\Repository\TransactionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TransactionRepository::class)]
class Transaction
{
   #[ORM\Id]
   #[ORM\GeneratedValue]
   #[ORM\Column]
   private ?int               $id = null;
   #[ORM\Column]
   private \DateTimeImmutable $createdAt;
   /**
    * @var Collection<int, Unit>
    */
   #[ORM\OneToMany(targetEntity: Unit::class, mappedBy: 'transaction', orphanRemoval: true)]
   private Collection   $units;
   #[ORM\ManyToOne(inversedBy: 'transactions')]
   #[ORM\JoinColumn(nullable: false)]
   private ?Event       $event       = null;
   #[ORM\Column(enumType: PaymentType::class)]
   private ?PaymentType $paymentType = null;

   public function __construct()
   {
      $this->createdAt = new \DateTimeImmutable();
      $this->units     = new ArrayCollection();
   }

   public function getId(): ?int
   {
      return $this->id;
   }

   public function getCreatedAt(): \DateTimeImmutable
   {
      return $this->createdAt;
   }

   /**
    * @return Collection<int, Unit>
    */
   public function getUnits(bool $activeSellersOnly = true): Collection
   {
      return $this->units;
   }

   public function getUnitsOfActiveSellers(): Collection
   {
      return new ArrayCollection(
         array_filter($this->units->toArray(), function (Unit $unit) {
            return $unit->getSeller()->isActive();
         }));
   }

   public function addUnit(Unit $unit): static
   {
      if (!$this->units->contains($unit))
      {
         $this->units->add($unit);
         $unit->setTransaction($this);
      }

      return $this;
   }

   public function removeUnit(Unit $unit): static
   {
      if ($this->units->removeElement($unit))
      {
         // set the owning side to null (unless already changed)
         if ($unit->getTransaction() === $this)
         {
            $unit->setTransaction(null);
         }
      }

      return $this;
   }

   public function removeUnits(): static
   {
      $this->units->clear();

      return $this;
   }

   public function getEvent(): ?Event
   {
      return $this->event;
   }

   public function setEvent(?Event $event): static
   {
      $this->event = $event;

      return $this;
   }

   public function getPaymentType(): ?PaymentType
   {
      return $this->paymentType;
   }

   public function setPaymentType(PaymentType $paymentType): static
   {
      $this->paymentType = $paymentType;

      return $this;
   }
}
