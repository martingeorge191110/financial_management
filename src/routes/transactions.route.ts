import express from "express";
import Transactions_controller from "../controllers/transactions.controller.ts";
import verify_token from "../middlewares/verify.token.ts";


const Transactions_route: express.Router = express.Router()

const transactions_instance: Transactions_controller = new Transactions_controller()


Transactions_route.use(verify_token)




Transactions_route.route("/")
                        .post(
                           transactions_instance.add_one_valid(),
                           transactions_instance.validation_error,
                           transactions_instance.add_one_controller
                        )
                        .get(
                           transactions_instance.get_all_transactions
                        )


Transactions_route.route("/current_month/")
                        .get(
                           transactions_instance.current_month_transactions
                        )


Transactions_route.route("/filter/")
                        .get(
                           transactions_instance.transactions_filter_valid(),
                           transactions_instance.validation_error,
                           transactions_instance.filter_controller
                        )

Transactions_route.route("/:id")
                        .all(
                           transactions_instance.transaction_id_valid(),
                           transactions_instance.validation_error
                        )
                        .put(
                           transactions_instance.update_one_controller
                        )
                        .delete(
                           transactions_instance.delete_transaction
                        )



export default Transactions_route;
