rotas da api

GET
/api/user -> rota autenticada para buscar todos os usuarios de um restaurante
/api/user/id -> rota autenticada para buscar um usuario especifico de um restaaurante

/api/table/id -> rota autenticada para buscar uma table especifica de um restaurante
/api/table -> rota autenticada para buscar todas as tables de um restaurante

/api/provider/id -> rota para buscar um provider e suas informações

/api/orderItem/orderId -> rota para buscar os orderItems do pedido

/api/order/userId -> rota para buscar os orders do userId
/api/order/tableId -> rota para buscar os orders do tableId
/api/order/providerId -> rota para buscar os orders do provider

/api/item/id -> rota para buscar um item de um provider pelo id especifico
/api/item -> rota para buscar todos os item de um provider

DELETE

/api/item/id -> rota autenticada para deletar um item de um provider

/api/order/id -> rota para deletar um order de um usuario