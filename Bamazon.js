'use strict';

var mysql = require('mysql');
var inquirer = require('inquirer');
var prompt = require('prompt');

 var connection = mysql.createConnection({
     host: "localhost",
     port: 3306,
     user: "root", 
     password: "", 
     database: "Bamazon"
 })

 connection.connect(function(err) {
    if(err) {
        console.log('Error connecting to Db');
        return;
    }
 });

function managerViewforBamazon() {

    inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: [
            new inquirer.Separator(),
            'View Products for Sale', 
            'View Low Inventory', 
            'Add to Inventory', 
            'Add New Product',
            new inquirer.Separator(),
            'Exit'
        ]
    },
    ]).then(function (answer) {
        switch(answer.action) {
            case 'View Products for Sale':
                viewProductsforSale();
            break;

            case 'View Low Inventory':
                viewLowInventory();
            break;

            case 'Add to Inventory':
                addtoInventory();
            break;

            case 'Add New Product':
                addNewProduct();
            break;
            
            case 'Exit':
                return;
            break;
        }
    });
}

function viewProductsforSale() {
    connection.query('SELECT * FROM products', function(err, rows) {
        if(!err) {
            for (var i = 0; i < rows.length; i++) {
                console.log(rows[i].ItemID + " | " 
                      + rows[i].ProductName + " | " 
                      + rows[i].DepartmentName + " | " 
                      + "$" + rows[i].Price + " | "
                      + rows[i].StockQuantity);
            }
            console.log("-----------------------------------");
        } 
    })
};

function viewLowInventory() {
    connection.query('SELECT * FROM products WHERE StockQuantity < 5', function(err, rows) {
        if(!err) {
            for (var i = 0; i < rows.length; i++) {
                console.log(rows[i].ItemID + " | " 
                      + rows[i].ProductName + " | " 
                      + rows[i].DepartmentName + " | " 
                      + "$" + rows[i].Price + " | "
                      + rows[i].StockQuantity);
            }
            console.log("-----------------------------------");
        } 
    })
};

function addtoInventory() {
    prompt.get(['ItemID', 'Quantity'], function(err, result) {
        var itemQTY = parseInt(result.Quantity);
        var itemID = parseInt(result.ItemID);
        connection.query("UPDATE Products SET StockQuantity = (StockQuantity + ?) WHERE ItemID = ?", 
             [itemQTY, itemID], function(err, row){
             if(err) throw err;
        });
    });

}

function addNewProduct() {
    prompt.get(['ProductName', 'DepartmentName', 'Price', 'StockQuantity'], function(err, result) {       
        var itemQTY = parseInt(result.StockQuantity);
        var query = "INSERT INTO Products (ProductName,DepartmentName,Price,StockQuantity)"
                  + "VALUES (?,?,?,?)"
        connection.query(query, 
          [result.ProductName, result.DepartmentName, result.Price, itemQTY], function(err, row) {
          if(err) throw err;
        });
    });
}


function customerViewforBamazon() {
    connection.query('SELECT * FROM products', function(err, rows) {
      inquirer.prompt({
           name: "choice",
           type: "rawlist",
           choices: function(value) {
               var choiceArray = [];
               for (var i = 0; i < rows.length; i++) {
                   choiceArray.push(rows[i].ProductName);
               }
               return choiceArray;
           },
           message: "What would you like to buy?"
       }).then(function(answer) {
           var i = 0, cont = true;
           while(i < rows.length && cont == true) {
              if ( rows[i].ProductName == answer.choice) {
                   cont = false;
                   var chosenItem = rows[i];
                   inquirer.prompt({
                       name: "qty",
                       type: "input",
                       message: "How many would you like to buy?"
                   }).then(function(answer) {
                      var qty = parseInt(answer.qty);
                      var itemID = parseInt(chosenItem.ItemID);
                      if (chosenItem.StockQuantity >= qty) {
                          var query = "UPDATE Products SET StockQuantity = (StockQuantity - ?) WHERE ItemID = ?";
                          connection.query(query, [qty, itemID], function(err, row) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log("Product :" + chosenItem.ProductName + " Quantity : "+qty);
                                console.log("Total Amount : $"+ qty*chosenItem.Price);
                            }
                          });
                       } else {
                          console.log("Insufficient quantity!");
                       }
                   });
              } else {
                 i++; 
              }
              
           }
           console.log("buraya");
       });
   });
}

function startBamazon() {

    inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: [
            new inquirer.Separator(),
            'Customer View', 
            'Manager View', 
            new inquirer.Separator(),
            'Exit'
        ]
    },
    ]).then(function (answer) {
        switch(answer.action) {
            case 'Customer View':
                customerViewforBamazon();
            break;

            case 'Manager View':
                managerViewforBamazon();
            break;

            case 'Exit':
                console.log('Thank you shoppping with us');
                console.log('Please visit us again');
                return;
            break;
        }
    });
}
 startBamazon();