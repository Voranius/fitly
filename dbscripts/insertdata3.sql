-- insert 10 dummy person
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('che.en@gmail.com', '1234', 'Sheena', 'Owens', 'F', '22', '1', '0');
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('chee.n@gmail.com', '1234', 'Chee Kiat', 'Ong', 'M', '33', '1', '0');
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('sab.ai@gmail.com', '1234', 'Mohd Fadzil', 'Abdullah', 'M', '31', '1', '0');
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('phan.g@gmail.com', '1234', 'Karen', 'Tan', 'F', '25', '1', '0');
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('c.heen@gmail.com', '1234', 'Johenson', 'Lam', 'F', '25', '2', '0');
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('ch.een@gmail.com', '1234', 'Henry', 'Lee', 'M', '31', '2', '0');
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('cheen@gmail.com', '1234', 'Charmaine', 'Wong', 'F', '27', '2', '0');
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('s.abai@gmail.com', '1234', 'David', 'Man', 'M', '24', '2', '0');
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('sa.bai@gmail.com', '1234', 'Henry', 'Kim', 'M', '28', '2', '0');
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('saba.i@gmail.com', '1234', 'Hee Min', 'Sim', 'M', '32', '2', '0');
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('sabai@gmail.com', '1234', 'Suzie', 'Wong', 'F', '28', '2', '0');
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('phang@gmail.com', '1234', 'N', 'Srikumar', 'M', '21', '2', '0');
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('p.hang@gmail.com', '1234', 'Lee', 'Chong', 'M', '35', '2', '0');
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('ph.ang@gmail.com', '1234', 'Azmi', 'Wahab', 'M', '30', '2', '0');
INSERT INTO `fitlydb`.`person` (`email`, `password`, `firstname`, `lastname`, `gender`, `age`, `role`, `status`) VALUES ('pha.ng@gmail.com', '1234', 'Zhi Mong', 'Ang', 'M', '22', '2', '0');

-- insert 4 dummy class
INSERT INTO `fitlydb`.`class` (`name`, `details`, `start_time`, `duration`, `addr_name`, `address1`, `neighbourhood`, `minsize`, `instructions`, `category`, `creator_id`) VALUES ('Crossfit for Beginners', 'A high-intensity fitness program incorporating elements from several sports and exercises.', '2017-11-19 10:00:00', 60, 'Matralix Gym', '250 Ayer Rajah Crescent', 'Ayer Rajah', 10, 'Bring your own towel.', 'Crossfit', 1);
INSERT INTO `fitlydb`.`class` (`name`, `details`, `start_time`, `duration`, `addr_name`, `address1`, `neighbourhood`, `minsize`, `instructions`, `category`, `creator_id`) VALUES ('Extreme Crossfit', 'An hour-long brutal X-fit workout to test the limits of your strength, speed and endurance.', '2017-11-17 17:30:00', 120, 'Matralix Gym', '250 Ayer Rajah Crescent', 'Ayer Rajah', 10, 'Participants must have attended Crossfit for Beginners', 'Crossfit', 1);
INSERT INTO `fitlydb`.`class` (`name`, `details`, `start_time`, `duration`, `addr_name`, `address1`, `neighbourhood`, `minsize`, `instructions`, `category`, `creator_id`) VALUES ('Core Workouts For A Tight Midsection', 'We will introduce 5 easy-to-follow workouts to help strengthen your midsection', '2017-12-02 08:00:00', 90, 'Gold Gym', '116A Tampines Ave 2 #01-116', 'Tampines', 8, 'Shower facility availalable', 'Core', 2);
INSERT INTO `fitlydb`.`class` (`name`, `details`, `start_time`, `duration`, `addr_name`, `address1`, `neighbourhood`, `minsize`, `instructions`, `category`, `creator_id`) VALUES ('Silver-ready Free-weights', 'Resistance exercises to strengthen your muscles, maintain healthy bone mass and prevent age-related muscle loss', '2017-11-30 12:15:00', 60, 'Jurong East Park', '67 Jurong East St 11', 'Jurong East', 5, 'Ask your doctor if there are any precautions you should take', 'Weights', 3);
INSERT INTO `fitlydb`.`class` (`name`, `details`, `start_time`, `duration`, `addr_name`, `address1`, `neighbourhood`, `minsize`, `instructions`, `category`, `creator_id`) VALUES ('Crossfit for Pregnant Women', 'A low-intensity program tailored for expectant mothers who are seeking a light workout during their delicate trimester', '2017-12-05 09:00:00', 60, 'Lorong J Telok Kurau Park', '31 Lorong J Telok Kurau', 'Bedok', 5, 'Ask your doctor if there are any precautions you should take', 'Crossfit', 4);

-- insert 8 dummy transaction
INSERT INTO `fitlydb`.`transaction` (`class_id`, `client_id`, `trainer_id`) VALUES (1, 5, 1);
INSERT INTO `fitlydb`.`transaction` (`class_id`, `client_id`, `trainer_id`) VALUES (1, 6, 1);
INSERT INTO `fitlydb`.`transaction` (`class_id`, `client_id`, `trainer_id`) VALUES (1, 7, 1);
INSERT INTO `fitlydb`.`transaction` (`class_id`, `client_id`, `trainer_id`) VALUES (1, 8, 1);
INSERT INTO `fitlydb`.`transaction` (`class_id`, `client_id`, `trainer_id`) VALUES (1, 9, 1);
INSERT INTO `fitlydb`.`transaction` (`class_id`, `client_id`, `trainer_id`) VALUES (1, 10, 1);
INSERT INTO `fitlydb`.`transaction` (`class_id`, `client_id`, `trainer_id`) VALUES (2, 11, 2);
INSERT INTO `fitlydb`.`transaction` (`class_id`, `client_id`, `trainer_id`) VALUES (2, 12, 2);
INSERT INTO `fitlydb`.`transaction` (`class_id`, `client_id`, `trainer_id`) VALUES (2, 13, 2);
INSERT INTO `fitlydb`.`transaction` (`class_id`, `client_id`, `trainer_id`) VALUES (2, 14, 2);
INSERT INTO `fitlydb`.`transaction` (`class_id`, `client_id`, `trainer_id`) VALUES (3, 15, 3);
INSERT INTO `fitlydb`.`transaction` (`class_id`, `client_id`, `trainer_id`) VALUES (3, 5, 3);
INSERT INTO `fitlydb`.`transaction` (`class_id`, `client_id`, `trainer_id`) VALUES (3, 5, 3);