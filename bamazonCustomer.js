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
            console.log("Product ID: " + res[i].item_id + "    " + res[i].product_name + "      Price: " + res[i].price);
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

            // console.log(answer.productID);
            // console.log(answer.quantity);
            checkAvailability(answer.productID, answer.quantity);

        });
};

function updateInventory(prodID, quantity) {
    var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
    connection.query(query, [quantity, prodID], function(err, res) {
        console.log("updated");
        // console.log(err);
    });
}

function checkAvailability(prodID, quantity) {
    var query = "SELECT products.stock_quantity, price FROM products WHERE ?";
    connection.query(query, { item_id: prodID }, function(err, res) {
        // console.log(res[0].stock_quantity);
        if ((res[0].stock_quantity) < quantity) {
            console.log("Insufficient quantity!");
        } else {
            newInventory = (res[0].stock_quantity) - quantity;
            // console.log("sure " + newInventory);

            console.log("total owed: $" + (quantity * (res[0].price)).toFixed(2));
            updateInventory(prodID, newInventory);

        }
        connection.end(function(err) {
            // The connection is terminated now
        });
    });


}