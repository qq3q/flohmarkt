<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250209214925 extends AbstractMigration
{
   public function getDescription(): string
   {
      return '';
   }

   public function up(Schema $schema): void
   {
      // this up() migration is auto-generated, please modify it to your needs
      $this->addSql('DELETE FROM access_token');
      $this->addSql('ALTER TABLE access_token ADD touched_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
   }

   public function down(Schema $schema): void
   {
      // this down() migration is auto-generated, please modify it to your needs
      $this->addSql('ALTER TABLE access_token DROP touched_at');
   }
}
