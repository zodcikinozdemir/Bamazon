CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE Products (
  ItemID INTEGER NOT NULL AUTO_INCREMENT,
  ProductName VARCHAR(255) NOT NULL,
  DepartmentName VARCHAR(255) NOT NULL,
  Price DECIMAL(5,2) NOT NULL,
  StockQuantity INTEGER NOT NULL,
  PRIMARY KEY (itemID)
);

INSERT INTO Products(ProductName,DepartmentName,Price,StockQuantity)
	VALUES ('essie Silk Watercolor Kit','Beauty',17.5,10);
INSERT INTO Products(ProductName,DepartmentName,Price,StockQuantity)
	VALUES ('Rubie''s Costume Astronaut Child''s Costume','Costumes',19.91,5);
INSERT INTO Products(ProductName,DepartmentName,Price,StockQuantity)
	VALUES ('Paw Patrol - Paw Patroller','Toys',40.79,6);	
INSERT INTO Products(ProductName,DepartmentName,Price,StockQuantity)
	VALUES ('Cool Short-sleeve Pink Panther Logo','Clothing',14.21,3);
INSERT INTO Products(ProductName,DepartmentName,Price,StockQuantity)
	VALUES ('Nike Women''s Flex 2016 Rn Running Shoe','Shoes',69.86,4);			
    
select * from Products;

UPDATE Products SET StockQuantity = (StockQuantity + ?) WHERE ItemID = ?, [2,1 ];
