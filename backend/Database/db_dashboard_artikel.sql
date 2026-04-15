-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema db_dashboard_artikel
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema db_dashboard_artikel
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `db_dashboard_artikel` DEFAULT CHARACTER SET utf8mb4 ;
USE `db_dashboard_artikel` ;

-- -----------------------------------------------------
-- Table `db_dashboard_artikel`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_dashboard_artikel`.`categories` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(50) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `slug` (`slug` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `db_dashboard_artikel`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_dashboard_artikel`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'editor') NULL DEFAULT 'editor',
  `status` ENUM('active', 'inactive') NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `db_dashboard_artikel`.`posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_dashboard_artikel`.`posts` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `thumbnail` VARCHAR(255) NULL DEFAULT NULL,
  `status` ENUM('draft', 'published') NULL DEFAULT 'draft',
  `views` INT(11) NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `update_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `users_id` INT(11) NOT NULL,
  `categories_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`, `users_id`, `categories_id`),
  UNIQUE INDEX `slug` (`slug` ASC) VISIBLE,
  INDEX `fk_posts_users_idx` (`users_id` ASC) VISIBLE,
  INDEX `fk_posts_categories1_idx` (`categories_id` ASC) VISIBLE,
  CONSTRAINT `fk_posts_users`
    FOREIGN KEY (`users_id`)
    REFERENCES `db_dashboard_artikel`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_posts_categories1`
    FOREIGN KEY (`categories_id`)
    REFERENCES `db_dashboard_artikel`.`categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
