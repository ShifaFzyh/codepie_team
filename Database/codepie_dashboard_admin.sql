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
CREATE SCHEMA IF NOT EXISTS `db_dashboard_artikel` DEFAULT CHARACTER SET utf8 ;
USE `db_dashboard_artikel` ;

-- -----------------------------------------------------
-- Table `db_dashboard_artikel`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_dashboard_artikel`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'editor') NULL DEFAULT 'editor',
  `status` ENUM('active', 'inactive') NULL DEFAULT 'active',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_dashboard_artikel`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_dashboard_artikel`.`categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(50) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `slug_UNIQUE` (`slug` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_dashboard_artikel`.`post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_dashboard_artikel`.`post` (
  `categories_id` INT NOT NULL,
  `users_id` INT NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(2555) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `thumbnail` VARCHAR(255) NULL,
  `status` ENUM('draft', 'published') NULL DEFAULT 'draft',
  `views` INT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`, `categories_id`, `users_id`),
  INDEX `fk_categories_has_users_users1_idx` (`users_id` ASC) VISIBLE,
  INDEX `fk_categories_has_users_categories_idx` (`categories_id` ASC) VISIBLE,
  UNIQUE INDEX `slug_UNIQUE` (`slug` ASC) VISIBLE,
  CONSTRAINT `fk_categories_has_users_categories`
    FOREIGN KEY (`categories_id`)
    REFERENCES `db_dashboard
  _artikel`.`categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_categories_has_users_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `db_dashboard
  _artikel`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_dashboard_artikel`.`timestamps`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_dashboard_artikel`.`timestamps` (
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
