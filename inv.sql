
CREATE TABLE customer(
    customer_id serial primary key,
    customer_name varchar(100),
    age numeric check (age>0 and age<100),
    email varchar(100) unique,
    cust_date timestamp default current_timestamp
);

INSERT INTO customer (customer_name,age,email) 
values ('virat',35,'virat@gmail.com');
