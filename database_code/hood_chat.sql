CREATE SCHEMA IF NOT EXISTS `hood_chat`;
USE `hood_chat`;

/* 1. user table */
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `user`;
SET FOREIGN_KEY_CHECKS = 1;
CREATE TABLE `hood_chat`.`user` (
  `uid` INT NOT NULL AUTO_INCREMENT,
  `uname` VARCHAR(45) NOT NULL,
  `ufullname` VARCHAR(45) NULL,
  `uaddress` VARCHAR(45) NULL,
  `uemail` VARCHAR(45) NULL,
  `upassword` VARCHAR(45) NULL,
  `uprofile` VARCHAR(45) NULL,
  `uphoto` VARCHAR(45) NULL,
  PRIMARY KEY (`uid`, `uname`));

insert into `user`(`uid`, `uname`, `ufullname`, `uaddress`, `uemail`, `upassword`, `uprofile`, `uphoto`) values
(1, 'Ares', 'Zuoyiwei Zhang', '', 'aczzyw@gmail.com', 'pwd1', 'A handsome boy', 'None'),
(2, 'Chuck', 'Rochak Agrawal', '', '24rochak@gmail.com', 'pwd2', 'A handsome boy too', 'None'),
(3, 'Ricky', 'Boqi Tan', '', 'ricky@gmail.com', 'pwd3', '', 'None'),
(4, 'Bob', 'Bobby Aloupis', '', 'bob@gmail.com', 'pwd4', '', 'None'),
(5, 'Amy', 'Amy Suel', '', 'amy@gmail.com', 'pwd5', '', 'None'),
(6, 'Tony', 'Tony Stark', '', 'tony123@gmail.com', 'pwd6', '', 'None'),
(7, 'Babala', 'Crise Potter', '', 'cp1997@gmail.com', 'pwd7', '', 'None'),
(8, 'Struke', 'Gary Lee', '', 'gary666@gmail.com', 'pwd8', '', 'None'),
(9, 'Doglike', 'Anna Mellon', '', 'annapretty@gmail.com', 'pwd9', '', 'None');


/* 2. hood table */
DROP TABLE IF EXISTS `hood`;
CREATE TABLE `hood_chat`.`hood` (
  `hid` INT NOT NULL AUTO_INCREMENT,
  `hname` VARCHAR(45) NOT NULL,
  `hsouthx` FLOAT NOT NULL,
  `hsouthy` FLOAT NOT NULL,
  `hnorthx` FLOAT NOT NULL,
  `hnorthy` FLOAT NOT NULL,
  PRIMARY KEY (`hid`));

insert into `hood`(`hid`, `hname`, `hsouthx`, `hsouthy`, `hnorthx`, `hnorthy`) values
(1, 'Bay Ridge', 0, 0, 0, 0),
(2, 'Park Slope', 0, 0, 0, 0);


/* 3. block table */
DROP TABLE IF EXISTS `block`;
CREATE TABLE `hood_chat`.`block` (
  `bid` INT NOT NULL AUTO_INCREMENT,
  `bname` VARCHAR(45) NOT NULL,
  `bsouthx` FLOAT NOT NULL,
  `bsouthy` FLOAT NOT NULL,
  `bnorthx` FLOAT NOT NULL,
  `bnorthy` FLOAT NOT NULL,
  PRIMARY KEY (`bid`));

insert into `block`(`bid`, `bname`, `bsouthx`, `bsouthy`, `bnorthx`, `bnorthy`) values
(1, '68th-74th street', 0, 0, 0, 0),
(2, '80th-91th street', 0, 0, 0, 0),
(3, '3rd-9th street', 0, 0, 0, 0);


/* 4. message table */
DROP TABLE IF EXISTS `message`;
CREATE TABLE `hood_chat`.`message` (
  `mid` INT NOT NULL AUTO_INCREMENT,
  `uid` INT NOT NULL,
  `mtitle` VARCHAR(45) NOT NULL,
  `mtimestamp` DATETIME NOT NULL,
  `mtext` VARCHAR(100) NOT NULL,
  `mx` FLOAT NULL,
  `my` FLOAT NULL,
  PRIMARY KEY (`mid`),
  INDEX `uid_idx` (`uid` ASC) VISIBLE,
  CONSTRAINT `uid`
    FOREIGN KEY (`uid`)
    REFERENCES `hood_chat`.`user` (`uid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

insert into `message`(`mid`, `uid`, `mtitle`, `mtimestamp`, `mtext`, `mx`, `my`) values
(1, 2, 'How to feed a dog', '2019-11-25 00:00:00', 'Do you have a dog?', 0, 0),
(2, 3, 'How to feed a dog', '2019-11-25 09:00:00', 'No. But I like dog!', 0, 0),
(3, 2, 'About your name', '2019-11-25 00:01:00', 'Your name is so cooool!', 0, 0),
(4, 5, 'About your name', '2019-11-25 08:01:00', 'Thank you so much :)', 0, 0),
(5, 4, 'About your home address', '2019-11-25 00:01:00', 'Where do you live? I cannot find your address on the map.', 0, 0),
(6, 2, 'Where can I wash clothes', '2019-11-25 03:00:00', 'Someone knows?', 0, 0),
(7, 2, 'Rent a car', '2019-11-25 03:00:00', 'I want to rent a car and I will pay $1000 for a day. Someone has?', 0, 0),
(8, 2, 'About car accident', '2019-11-25 06:00:00', 'Where is the bicycle accident happenned?', 0, 0),
(9, 2, 'About car accident', '2019-11-25 06:00:00', 'Really? Sounds terrible!', 0, 0),
(10, 2, 'Basketball match', '2019-11-25 09:00:00', 'Does anyone like playing basketball?', 0, 0);


/* 5. topic table */
DROP TABLE IF EXISTS `topic`;
CREATE TABLE `hood_chat`.`topic` (
  `tid` INT NOT NULL AUTO_INCREMENT,
  `tsubject` VARCHAR(45) NULL,
  `ttype` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`tid`));

insert into `topic`(`tid`, `tsubject`, `ttype`) values
(1, 'dog', 'friend'),
(2, 'cat', 'neighbor'),
(3, 'car', 'block'),
(4, 'food', 'hood');


/* 6. thread table */
DROP TABLE IF EXISTS `thread`;
CREATE TABLE `hood_chat`.`thread` (
  `thid` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`thid`));

insert into `thread`(`thid`) values
(1),
(2),
(3),
(4),
(5),
(6),
(7);


/* 7. notification table */
DROP TABLE IF EXISTS `notification`;
CREATE TABLE `hood_chat`.`notification` (
  `uid` INT NOT NULL,
  `nfriend` TINYINT NULL,
  `nneighbor` TINYINT NULL,
  `nblock` TINYINT NULL,
  `nhood` TINYINT NULL,
  PRIMARY KEY (`uid`));


/* 8. lastvisit table */
DROP TABLE IF EXISTS `lastvisit`;
CREATE TABLE `hood_chat`.`lastvisit` (
  `uid` INT NOT NULL,
  `ltimestamp` DATETIME NOT NULL,
  PRIMARY KEY (`uid`));

insert into `lastvisit`(`uid`, `ltimestamp`) values
(1, '2019-11-25 00:00:00'),
(2, '2019-11-25 02:00:00'),
(3, '2019-11-25 00:00:00'),
(4, '2019-11-25 00:00:00'),
(5, '2019-11-25 00:00:00'),
(6, '2019-11-25 00:00:00'),
(7, '2019-11-25 00:00:00'),
(8, '2019-11-25 00:00:00'),
(9, '2019-11-25 00:00:00');

/* 9. applies table */
DROP TABLE IF EXISTS `applies`;
CREATE TABLE `hood_chat`.`applies` (
  `uid` INT NOT NULL,
  `bid` INT NOT NULL,
  `acount` INT NOT NULL,
  PRIMARY KEY (`uid`, `bid`));

insert into `applies`(`uid`, `bid`, `acount`) values
(1, 1, 0);


/* 10. ins table */
DROP TABLE IF EXISTS `ins`;
CREATE TABLE `hood_chat`.`ins` (
  `uid` INT NOT NULL,
  `bid` INT NOT NULL,
  PRIMARY KEY (`uid`, `bid`));

insert into `ins`(`uid`, `bid`) values
(2, 1),
(3, 1), 
(4, 1),
(5, 2),
(6, 2),
(7, 2),
(8, 3),
(9, 3);


/* 11. belongs table */
DROP TABLE IF EXISTS `belongs`;
CREATE TABLE `hood_chat`.`belongs` (
  `hid` INT NOT NULL,
  `bid` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`hid`, `bid`));

insert into `belongs`(`hid`, `bid`) values
(1, 1), 
(1, 2), 
(2, 3);


/* 12. friends table */
DROP TABLE IF EXISTS `friends`;
CREATE TABLE `hood_chat`.`friends` (
  `uid` INT NOT NULL,
  `fid` INT NOT NULL,
  PRIMARY KEY (`uid`, `fid`),
  INDEX `fid_idx` (`fid` ASC) VISIBLE,
  CONSTRAINT `fid`
    FOREIGN KEY (`fid`)
    REFERENCES `hood_chat`.`user` (`uid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

insert into `friends`(`uid`, `fid`) values
(2, 3),
(3, 2),
(2, 5),
(5, 2);

/* 13. neighbors table */
DROP TABLE IF EXISTS `neighbors`;
CREATE TABLE `hood_chat`.`neighbors` (
  `uid` INT NOT NULL,
  `nid` INT NOT NULL,
  PRIMARY KEY (`uid`, `nid`),
  INDEX `nid_idx` (`nid` ASC) VISIBLE,
  CONSTRAINT `nid`
    FOREIGN KEY (`nid`)
    REFERENCES `hood_chat`.`user` (`uid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

insert into `neighbors`(`uid`, `nid`) values
(2, 4);

/* 14. posts table */
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `hood_chat`.`posts` (
  `uid` INT NOT NULL,
  `tid` INT NOT NULL,
  PRIMARY KEY (`uid`, `tid`));

insert into `posts`(`uid`, `tid`) values
(2, 1),
(2, 2),
(2, 3),
(2, 4);


/* 15. contains table */
DROP TABLE IF EXISTS `contains`;
CREATE TABLE `hood_chat`.`contains` (
  `tid` INT NOT NULL,
  `thid` INT NOT NULL,
  PRIMARY KEY (`tid`, `thid`));

insert into `contains`(`tid`, `thid`) values
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(3, 5),
(4, 6),
(5, 7);


/* 16. has table */
DROP TABLE IF EXISTS `has`;
CREATE TABLE `hood_chat`.`has` (
  `thid` INT NOT NULL,
  `mid` INT NOT NULL,
  PRIMARY KEY (`thid`, `mid`));
  
insert into `has`(`thid`, `mid`) values
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(4, 6),
(5, 7),
(6, 8),
(6, 9),
(7, 10);


/* 17. replies table */
DROP TABLE IF EXISTS `replies`;
CREATE TABLE `hood_chat`.`replies` (
  `uid` INT NOT NULL,
  `mid` INT NOT NULL,
  PRIMARY KEY (`uid`, `mid`));


/* 18. unreads table */
DROP TABLE IF EXISTS `unreads`;
CREATE TABLE `hood_chat`.`unreads` (
  `uid` INT NOT NULL,
  `mid` INT NOT NULL,
  PRIMARY KEY (`uid`, `mid`));


/* 19. reads table */
DROP TABLE IF EXISTS `reads`;
CREATE TABLE `hood_chat`.`reads` (
  `uid` INT NOT NULL,
  `mid` INT NOT NULL,
  PRIMARY KEY (`uid`, `mid`));


/* 20. accesses table */
DROP TABLE IF EXISTS `accesses`;
CREATE TABLE `hood_chat`.`accesses` (
  `mid` INT NOT NULL,
  `uid` INT NOT NULL,
  PRIMARY KEY (`uid`, `mid`));

insert into `accesses`(`mid`, `uid`) values
(1, 2),
(1, 3),
(2, 2),
(2, 3),
(3, 2),
(3, 5),
(4, 2),
(4, 5),
(5, 2),
(5, 4),
(6, 2),
(6, 3),
(6, 4),
(7, 2),
(7, 3),
(8, 2),
(8, 3),
(8, 4),
(8, 5),
(8, 6),
(8, 7),
(9, 2),
(9, 3),
(9, 4),
(9, 5),
(9, 6),
(9, 7),
(10, 2),
(10, 3),
(10, 4),
(10, 5),
(10, 6);


/* 21. specifies table */
DROP TABLE IF EXISTS `specifies`;
CREATE TABLE `hood_chat`.`specifies` (
  `tid` INT NOT NULL,
  `uid` INT NOT NULL,
  PRIMARY KEY (`tid`, `uid`));

insert into `specifies`(`tid`, `uid`) values
(1, 2), 
(2, 2),
(3, 2),
(4, 2),
(1, 3),
(1, 5),
(2, 4),
(3, 3),
(3, 4),
(4, 3),
(4, 4),
(4, 5),
(4, 6),
(4, 7);
