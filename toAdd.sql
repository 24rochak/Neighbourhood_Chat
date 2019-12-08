drop procedure if exists friend_location;
delimiter $$
create procedure friend_location
	(in userid int)
    begin
	drop table if exists user_friends ;
	create table user_friends as 
		select f1.fid
		from friends as f1, friends as f2
		where f1.uid = f2.fid and f1.fid = f2.uid and f1.uid = userid;

	select user_friends.fid,ux,uy,user.uname,user.uphoto from user_friends join user on user.uid=user_friends.fid;
	drop table user_friends;
    end;
    $$
delimiter ;

drop procedure if exists neighbour_location;
delimiter $$
create procedure neighbour_location
	(in userid int)
    begin
	drop table if exists user_neighbors;
	create table user_neighbors as 
		select nid from neighbors where uid = userid;
        
	select user_neighbors.nid,ux,uy,user.uname,user.uphoto from user_neighbors join user on user.uid=user_neighbors.nid;
	drop table user_neighbors;
    end;
    $$
delimiter ;

drop procedure if exists block_locations;
delimiter $$
create procedure block_locations
	(in userid int)
	begin
    drop table if exists hood_blocks;
    create table hood_blocks as (select bid from belongs where hid = (select hid from belongs where bid = (select bid from ins where uid=userid)));
    select block.bid,bsouthx,bsouthy,bnorthx,bnorthy from block join hood_blocks on hood_blocks.bid=block.bid;
    drop table hood_blocks;
    end;
    $$
    delimiter ;

drop procedure if exists hood_location;
delimiter $$
create procedure hood_location
	(in userid int)
	begin
    drop table if exists hood_id;
    create table hood_id as (select hid from belongs where bid=(select bid from ins where uid=userid));
    select hood.hid,hsouthx,hsouthy,hnorthx,hnorthy from hood join hood_id on hood_id.hid=hood.hid;
    drop table hood_id;
    end;
    $$
    delimiter ;	

alter table user
add column(ux double);

alter table user
add column(uy double);

update user set ux = 40.637362, uy=-74.032494 where uid=2;
update user set ux = 40.6360470, uy=-74.0317462 where uid=3;
update user set ux = 40.635829,uy=-74.033557 where uid=4;

update user set ux = 40.6320671,uy = -74.0256347 where uid =5;
update user set ux = 40.634003, uy = -74.023018 where uid =6;
update user set ux = 40.634231, uy = -74.020389 where uid =7;

update user set ux = 40.672565, uy = -73.981554 where uid=8;
update user set ux = 40.6722327,uy = -73.9842935 where uid = 9;

alter table block
modify column bsouthx double,modify column bsouthy double,modify column bnorthx double,modify column bnorthy double;
update block set bsouthx = 40.635429,bsouthy = -74.034971, bnorthx = 40.638271, bnorthy = -74.030840 where bid=1;
update block set bsouthx = 40.631507,bsouthy = -74.0277529, bnorthx = 40.633427,bnorthy = -74.021047 where bid=2;

alter table hood
modify column hsouthx double,modify column hsouthy double,modify column hnorthx double,modify column hnorthy double;
update hood set hsouthx = 40.615977,hsouthy =  -74.042782, hnorthx = 40.638389, hnorthy =  -74.013777 where hid=1;


alter table message
modify column mx double, modify column my double;

update message set mx = 40.632914, my= -74.029403 where mid = 1;
update message set mx = 40.638320, my= -74.026313 where mid = 2;
update message set mx = 40.638252, my= -74.019233 where mid = 3;
update message set mx = 40.631174, my= -74.035730 where mid = 4;
update message set mx = 40.632820, my= -74.017872 where mid = 5;
update message set mx = 40.638016, my= -74.028584 where mid = 6;
update message set mx = 40.629627, my= -74.028047 where mid = 7;
update message set mx = 40.634922, my= -74.027409 where mid = 8;
update message set mx = 40.671827, my= -73.975917 where mid = 9;
update message set mx = 40.672245, my= -73.981794 where mid = 10;