create table signupdetails(
    index_no SERIAL not null primary key,
    mail_id Varchar(200) ,  
    password Varchar(300) ,
    usertype VARCHAR(100),
    otp VARCHAR(100)
    
    )

INSERT INTO signupdetails
 ( mail_id, password,usertype,otp)
 VALUES( 'samiksha@gmail.com', 'samiksha','user','94587');


INSERT INTO signupdetails
 ( mail_id, password,usertype,otp)
 VALUES( 'samikshagupta@gmail.com', 'sami','admin','94586');
   
drop table signupdetails 
    
select * from signupdetails
   

    
   
    