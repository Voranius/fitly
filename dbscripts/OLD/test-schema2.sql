CREATE DATABASE if not exists `fitlydb` ;
USE `fitlydb`;


-- person table
CREATE TABLE if not exists `person`
(
  `id` INT(11) AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(64) NOT NULL,
  `firstname` VARCHAR(45) NOT NULL,
  `lastname` VARCHAR(45) NOT NULL,
  `gender` CHAR(1),
  `age` INT,
  `id_num` VARCHAR(10),
  `id_type` CHAR(1),
  `role` TINYINT,
  `status` TINYINT,
  `createdAt` DATETIME,
  `updatedAt` DATETIME,
  `deletedAt` DATETIME,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
);

-- admin table
CREATE TABLE if not exists `admin`
(
  `id` INT(11) AUTO_INCREMENT,

  `person_id` int(11) NOT NULL,
  `createdAt` DATETIME,
  `updatedAt` DATETIME,
  `deletedAt` DATETIME,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`person_id`) REFERENCES `fitlydb`.`person`(`id`)
);

-- trainer table
CREATE TABLE if not exists `trainer`
(
  `id` INT(11) AUTO_INCREMENT,
  `status` TINYINT,
  `person_id` int(11) NOT NULL,
  `createdAt` DATETIME,
  `updatedAt` DATETIME,
  `deletedAt` DATETIME,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`person_id`) REFERENCES `fitlydb`.`person`(`id`)
);

-- client table
CREATE TABLE if not exists `client`
(
  `id` INT(11) AUTO_INCREMENT,
  `status` TINYINT,
  `person_id` int(11) NOT NULL,
  `createdAt` DATETIME,
  `updatedAt` DATETIME,
  `deletedAt` DATETIME,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`person_id`) REFERENCES `fitlydb`.`person`(`id`)
);

-- location table
CREATE TABLE if not exists `location`
(
  `id` INT(11) AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `address1` VARCHAR(45) NOT NULL,
  `address2` VARCHAR(45),
  `postcode` CHAR(6),
  `neighbourhood` VARCHAR(20),
  `longtitude` DECIMAL(9,6),
  `latitude` DECIMAL(9,6),
  PRIMARY KEY (`id`)
);

-- class table
CREATE TABLE if not exists `class`
(
  `id` INT(11) AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `details` VARCHAR(255),
  `category` varchar(10),
  `creator_id` int(11) NOT NULL,
  `status` TINYINT,
  `createdAt` DATETIME,
  `updatedAt` DATETIME,
  `deletedAt` DATETIME,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`creator_id`) REFERENCES `fitlydb`.`trainer`(`id`)
);

-- run table
-- a class can have multiple repeated runs
CREATE TABLE if not exists `run`
(
  `id` INT(11) AUTO_INCREMENT,
  `start_time` DATETIME,
  `duration` INT,
  `minsize` INT,
  `maxsize` INT,
  `instructions` VARCHAR(255),
  `status` TINYINT,
  `class_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `backup_id` int(11) NOT NULL,
  `createdAt` DATETIME,
  `updatedAt` DATETIME,
  `deletedAt` DATETIME,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`class_id`) REFERENCES `fitlydb`.`class`(`id`),
  FOREIGN KEY (`location_id`) REFERENCES `fitlydb`.`location`(`id`),
  FOREIGN KEY (`backup_id`) REFERENCES `fitlydb`.`trainer`(`id`)
);

-- transaction table
CREATE TABLE if not exists `transaction`
(
  `id` INT(11) AUTO_INCREMENT,
  `run_id` INT(11) NOT NULL,
  `client_id` INT(11) NOT NULL,
  `trainer_id` INT(11) NOT NULL,
  `createdAt` DATETIME,
  `updatedAt` DATETIME,
  `deletedAt` DATETIME,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`run_id`) REFERENCES `fitlydb`.`run`(`id`),
  FOREIGN KEY (`client_id`) REFERENCES `fitlydb`.`client`(`id`),
  FOREIGN KEY (`trainer_id`) REFERENCES `fitlydb`.`trainer`(`id`)
);
