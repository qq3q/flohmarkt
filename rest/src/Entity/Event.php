<?php

namespace App\Entity;

use App\Repository\EventRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EventRepository::class)]
class Event
{
   #[ORM\Id]
   #[ORM\GeneratedValue]
   #[ORM\Column]
   private ?int $id = null;

   #[ORM\Column(length: 255)]
   private ?string $title = null;
   #[ORM\Column]
   private float $donationRate = 0.15;
   /**
    * @var Collection<int, Transaction>
    */
   #[ORM\OneToMany(targetEntity: Transaction::class, mappedBy: 'event', orphanRemoval: true)]
   private Collection $transactions;
   #[ORM\Column]
   private \DateTimeImmutable $createdAt;
   #[ORM\Column]
   private ?bool $active = null;

   public function __construct()
   {
      $this->transactions = new ArrayCollection();
      $this->createdAt    = new \DateTimeImmutable();
   }

   public function getId(): ?int
   {
      return $this->id;
   }

   public function getTitle(): ?string
   {
      return $this->title;
   }

   public function setTitle(string $title): static
   {
      $this->title = $title;

      return $this;
   }

   public function getDonationRate(): float
   {
      return $this->donationRate;
   }

   public function setDonationRate(float $donationRate): Event
   {
      $this->donationRate = $donationRate;

      return $this;
   }

   /**
    * @return Collection<int, Transaction>
    */
   public function getTransactions(): Collection
   {
      return $this->transactions;
   }

   public function addTransaction(Transaction $transaction): static
   {
      if (!$this->transactions->contains($transaction))
      {
         $this->transactions->add($transaction);
         $transaction->setEvent($this);
      }

      return $this;
   }

   public function removeTransaction(Transaction $transaction): static
   {
      if ($this->transactions->removeElement($transaction))
      {
         // set the owning side to null (unless already changed)
         if ($transaction->getEvent() === $this)
         {
            $transaction->setEvent(null);
         }
      }

      return $this;
   }

   public function getCreatedAt(): \DateTimeImmutable
   {
      return $this->createdAt;
   }

   public function isActive(): ?bool
   {
      return $this->active;
   }

   public function setActive(bool $active): static
   {
      $this->active = $active;

      return $this;
   }
}
