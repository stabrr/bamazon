var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "***REMOVED***",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    displayProducts();
});

function displayProducts() {
    var query = "select products.item_id, products.product_name, products.price FROM products";
    connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price);
        }
        buyProduct();
    });
}

function buyProduct() {
    inquirer
        .prompt([{
                name: "productID",
                type: "input",
                message: "What is the Product ID Number of the item you want to purchase?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "quantity?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {

            console.log(answer.productID);
            console.log(answer.quantity);
            checkAvailability(answer.productID, answer.quantity);

        });
};

function checkAvailability(prodID, quantity) {
    var query = "SELECT products.stock_quantity FROM products WHERE ?";
    connection.query(query, { item_id: prodID }, function(err, res) {
        console.log(res[0].stock_quantity);
        if ((res[0].stock_quantity) < quantity) {
            console.log("sorry not we do not have enough to sell you!");
        } else {
            console.log("sure " + ((res[0].stock_quantity) - quantity));
        }
    });

}