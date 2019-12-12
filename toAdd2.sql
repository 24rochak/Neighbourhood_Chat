drop procedure if exists get_requests;
	delimiter $$
create procedure get_requests(
	in usrid int)
    begin
    drop table if exists temp;
    create table temp as (with `requests` as (SELECT uid FROM hood_chat.friends where fid=usrid) select * from requests where requests.uid not in(SELECT fid FROM hood_chat.friends where uid=usrid));
    select user.uid, user.uemail, user.uname, user.ufullname from temp join user on user.uid=temp.uid;
	drop table temp;
    end;
    $$
    delimiter ;
    
call get_requests(2);

