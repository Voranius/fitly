-- insert 10 dummy users
INSERT INTO `fitness`.`users` (`email`, `password`, `role`, `firstname`, `lastname`, `status`) VALUES ('c.heen@gmail.com', '1234', '1', 'Johenson', 'Lam', '0');
INSERT INTO `fitness`.`users` (`email`, `password`, `role`, `firstname`, `lastname`, `status`) VALUES ('ch.een@gmail.com', '1234', '1', 'Henry', 'Lee', '0');
INSERT INTO `fitness`.`users` (`email`, `password`, `role`, `firstname`, `lastname`, `status`) VALUES ('che.en@gmail.com', '1234', '1', 'Sheena', 'Owens', '0');
INSERT INTO `fitness`.`users` (`email`, `password`, `role`, `firstname`, `lastname`, `status`) VALUES ('chee.n@gmail.com', '1234', '1', 'Chee Kiat', 'Ong', '0');
INSERT INTO `fitness`.`users` (`email`, `password`, `role`, `firstname`, `lastname`, `status`) VALUES ('cheen@gmail.com', '1234', '1', 'Charmaine', 'Wong', '0');
INSERT INTO `fitness`.`users` (`email`, `password`, `role`, `firstname`, `lastname`, `status`) VALUES ('s.abai@gmail.com', '1234', '1', 'David', 'Man', '0');
INSERT INTO `fitness`.`users` (`email`, `password`, `role`, `firstname`, `lastname`, `status`) VALUES ('sa.bai@gmail.com', '1234', '1', 'Henry', 'Kim', '0');
INSERT INTO `fitness`.`users` (`email`, `password`, `role`, `firstname`, `lastname`, `status`) VALUES ('sab.ai@gmail.com', '1234', '1', 'Mohd Fadzil', 'Abdullah', '0');
INSERT INTO `fitness`.`users` (`email`, `password`, `role`, `firstname`, `lastname`, `status`) VALUES ('saba.i@gmail.com', '1234', '1', 'Hee Min', 'Sim', '0');
INSERT INTO `fitness`.`users` (`email`, `password`, `role`, `firstname`, `lastname`, `status`) VALUES ('sabai@gmail.com', '1234', '1', 'Suzie', 'Wong', '0');

-- insert 8 qualifications/categories for trainers
INSERT INTO `fitness`.`qualifications` (`q_code`, `q_name`) VALUES ('F001', 'Crossfit');
INSERT INTO `fitness`.`qualifications` (`q_code`, `q_name`) VALUES ('F002', 'MMA');
INSERT INTO `fitness`.`qualifications` (`q_code`, `q_name`) VALUES ('F003', 'Core');
INSERT INTO `fitness`.`qualifications` (`q_code`, `q_name`) VALUES ('F004', 'Weights');
INSERT INTO `fitness`.`qualifications` (`q_code`, `q_name`) VALUES ('F005', 'Spinning');
INSERT INTO `fitness`.`qualifications` (`q_code`, `q_name`) VALUES ('F006', 'Aerobics');
INSERT INTO `fitness`.`qualifications` (`q_code`, `q_name`) VALUES ('F007', 'Boxing');
INSERT INTO `fitness`.`qualifications` (`q_code`, `q_name`) VALUES ('F008', 'Barre');

-- link both users and their qualified categories. Some trainers has more than one
INSERT INTO `fitness`.`userqualify` (`user_id`, `qualify_id`) VALUES (1, 'F001');
INSERT INTO `fitness`.`userqualify` (`user_id`, `qualify_id`) VALUES (2, 'F002');
INSERT INTO `fitness`.`userqualify` (`user_id`, `qualify_id`) VALUES (3, 'F003');
INSERT INTO `fitness`.`userqualify` (`user_id`, `qualify_id`) VALUES (3, 'F004');
INSERT INTO `fitness`.`userqualify` (`user_id`, `qualify_id`) VALUES (4, 'F005');
INSERT INTO `fitness`.`userqualify` (`user_id`, `qualify_id`) VALUES (5, 'F006');
INSERT INTO `fitness`.`userqualify` (`user_id`, `qualify_id`) VALUES (6, 'F007');
INSERT INTO `fitness`.`userqualify` (`user_id`, `qualify_id`) VALUES (6, 'F008');
INSERT INTO `fitness`.`userqualify` (`user_id`, `qualify_id`) VALUES (7, 'F001');
INSERT INTO `fitness`.`userqualify` (`user_id`, `qualify_id`) VALUES (8, 'F003');
INSERT INTO `fitness`.`userqualify` (`user_id`, `qualify_id`) VALUES (9, 'F004');
INSERT INTO `fitness`.`userqualify` (`user_id`, `qualify_id`) VALUES (10, 'F003');