export const DIAMOND_EVENTS = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "merchant",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum OrderProcessorStorage.OrderType",
                "name": "orderType",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "placedTimestamp",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fiatAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "placedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "completedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userCompletedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "acceptedMerchant",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipientAddr",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "pubkey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "userCompleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderType",
                        "name": "orderType",
                        "type": "uint8"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum OrderProcessorStorage.Entity",
                                "name": "raisedBy",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum OrderProcessorStorage.DisputeStatus",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "redactTransId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "accountNumber",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderProcessorStorage.Dispute",
                        "name": "disputeInfo",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "userPubKey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encMerchantUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "acceptedAccountNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "assignedAccountNos",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "currency",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "preferredPaymentChannelConfigId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "circleId",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct OrderProcessorStorage.Order",
                "name": "_order",
                "type": "tuple"
            }
        ],
        "name": "OrderPlaced",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "merchant",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fiatAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "placedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "completedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userCompletedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "acceptedMerchant",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipientAddr",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "pubkey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "userCompleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderType",
                        "name": "orderType",
                        "type": "uint8"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum OrderProcessorStorage.Entity",
                                "name": "raisedBy",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum OrderProcessorStorage.DisputeStatus",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "redactTransId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "accountNumber",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderProcessorStorage.Dispute",
                        "name": "disputeInfo",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "userPubKey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encMerchantUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "acceptedAccountNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "assignedAccountNos",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "currency",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "preferredPaymentChannelConfigId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "circleId",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct OrderProcessorStorage.Order",
                "name": "_order",
                "type": "tuple"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "accountNo",
                "type": "uint256"
            }
        ],
        "name": "MerchantAssignedNewOrder",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            }
        ],
        "name": "MerchantsReAssigned",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "merchant",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fiatAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "placedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "completedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userCompletedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "acceptedMerchant",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipientAddr",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "pubkey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "userCompleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderType",
                        "name": "orderType",
                        "type": "uint8"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum OrderProcessorStorage.Entity",
                                "name": "raisedBy",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum OrderProcessorStorage.DisputeStatus",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "redactTransId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "accountNumber",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderProcessorStorage.Dispute",
                        "name": "disputeInfo",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "userPubKey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encMerchantUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "acceptedAccountNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "assignedAccountNos",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "currency",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "preferredPaymentChannelConfigId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "circleId",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct OrderProcessorStorage.Order",
                "name": "_order",
                "type": "tuple"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "accountNo",
                "type": "uint256"
            }
        ],
        "name": "MerchantReAssignedNewOrder",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "merchant",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "pubKey",
                "type": "string"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fiatAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "placedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "completedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userCompletedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "acceptedMerchant",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipientAddr",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "pubkey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "userCompleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderType",
                        "name": "orderType",
                        "type": "uint8"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum OrderProcessorStorage.Entity",
                                "name": "raisedBy",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum OrderProcessorStorage.DisputeStatus",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "redactTransId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "accountNumber",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderProcessorStorage.Dispute",
                        "name": "disputeInfo",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "userPubKey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encMerchantUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "acceptedAccountNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "assignedAccountNos",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "currency",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "preferredPaymentChannelConfigId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "circleId",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct OrderProcessorStorage.Order",
                "name": "_order",
                "type": "tuple"
            }
        ],
        "name": "OrderAccepted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fiatAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "placedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "completedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userCompletedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "acceptedMerchant",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipientAddr",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "pubkey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "userCompleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderType",
                        "name": "orderType",
                        "type": "uint8"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum OrderProcessorStorage.Entity",
                                "name": "raisedBy",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum OrderProcessorStorage.DisputeStatus",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "redactTransId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "accountNumber",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderProcessorStorage.Dispute",
                        "name": "disputeInfo",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "userPubKey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encMerchantUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "acceptedAccountNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "assignedAccountNos",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "currency",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "preferredPaymentChannelConfigId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "circleId",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct OrderProcessorStorage.Order",
                "name": "_order",
                "type": "tuple"
            }
        ],
        "name": "BuyOrderPaid",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fiatAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "placedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "completedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userCompletedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "acceptedMerchant",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipientAddr",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "pubkey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "userCompleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderType",
                        "name": "orderType",
                        "type": "uint8"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum OrderProcessorStorage.Entity",
                                "name": "raisedBy",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum OrderProcessorStorage.DisputeStatus",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "redactTransId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "accountNumber",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderProcessorStorage.Dispute",
                        "name": "disputeInfo",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "userPubKey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encMerchantUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "acceptedAccountNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "assignedAccountNos",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "currency",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "preferredPaymentChannelConfigId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "circleId",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct OrderProcessorStorage.Order",
                "name": "_order",
                "type": "tuple"
            }
        ],
        "name": "SellOrderUpiSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "completedTimestamp",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fiatAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "placedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "completedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userCompletedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "acceptedMerchant",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipientAddr",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "pubkey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "userCompleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderType",
                        "name": "orderType",
                        "type": "uint8"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum OrderProcessorStorage.Entity",
                                "name": "raisedBy",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum OrderProcessorStorage.DisputeStatus",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "redactTransId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "accountNumber",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderProcessorStorage.Dispute",
                        "name": "disputeInfo",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "userPubKey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encMerchantUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "acceptedAccountNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "assignedAccountNos",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "currency",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "preferredPaymentChannelConfigId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "circleId",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct OrderProcessorStorage.Order",
                "name": "_order",
                "type": "tuple"
            }
        ],
        "name": "OrderCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fiatAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "placedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "completedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userCompletedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "acceptedMerchant",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipientAddr",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "pubkey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "userCompleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderType",
                        "name": "orderType",
                        "type": "uint8"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum OrderProcessorStorage.Entity",
                                "name": "raisedBy",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum OrderProcessorStorage.DisputeStatus",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "redactTransId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "accountNumber",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderProcessorStorage.Dispute",
                        "name": "disputeInfo",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "userPubKey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encMerchantUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "acceptedAccountNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "assignedAccountNos",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "currency",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "preferredPaymentChannelConfigId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "circleId",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct OrderProcessorStorage.Order",
                "name": "_order",
                "type": "tuple"
            }
        ],
        "name": "CancelledOrders",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "cancelledBy",
                "type": "address"
            }
        ],
        "name": "OrderCancelledBy",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "by",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fiatAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "placedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "completedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userCompletedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "acceptedMerchant",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipientAddr",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "pubkey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "userCompleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderType",
                        "name": "orderType",
                        "type": "uint8"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum OrderProcessorStorage.Entity",
                                "name": "raisedBy",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum OrderProcessorStorage.DisputeStatus",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "redactTransId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "accountNumber",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderProcessorStorage.Dispute",
                        "name": "disputeInfo",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "userPubKey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encMerchantUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "acceptedAccountNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "assignedAccountNos",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "currency",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "preferredPaymentChannelConfigId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "circleId",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct OrderProcessorStorage.Order",
                "name": "_order",
                "type": "tuple"
            },
            {
                "indexed": false,
                "internalType": "enum OrderProcessorStorage.FaultType",
                "name": "faultType",
                "type": "uint8"
            }
        ],
        "name": "OrderDispute",
        "type": "event"
    },
]

export const DIAMOND_FUNCTIONS = [
    {
        "inputs": [
            {
                "internalType": "uint256[]",
                "name": "orderIds",
                "type": "uint256[]"
            }
        ],
        "name": "cancelBulkOrders",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_nativeCurrency",
                "type": "bytes32"
            }
        ],
        "name": "getExchangeFiatBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_nativeCurrency",
                "type": "bytes32"
            }
        ],
        "name": "getExchangeLiquidityBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_currency",
                "type": "bytes32"
            }
        ],
        "name": "getPriceConfig",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "buyPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "sellPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "int256",
                        "name": "buyPriceOffset",
                        "type": "int256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "baseSpread",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct P2pConfigStorage.PriceConfig",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            }
        ],
        "name": "getOrdersById",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fiatAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "placedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "completedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userCompletedTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "acceptedMerchant",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipientAddr",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "pubkey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "userCompleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum OrderProcessorStorage.OrderType",
                        "name": "orderType",
                        "type": "uint8"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum OrderProcessorStorage.Entity",
                                "name": "raisedBy",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum OrderProcessorStorage.DisputeStatus",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "redactTransId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "accountNumber",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct OrderProcessorStorage.Dispute",
                        "name": "disputeInfo",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "userPubKey",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encMerchantUpi",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "acceptedAccountNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "assignedAccountNos",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "currency",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "preferredPaymentChannelConfigId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "circleId",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct OrderProcessorStorage.Order",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "merchant",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "telegramId",
                        "type": "string"
                    },
                    {
                        "internalType": "enum MerchantRegistryStorage.RiskCategory",
                        "name": "riskCategory",
                        "type": "uint8"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "paymentChannelConfigId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "accountNo",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "label",
                                "type": "string"
                            },
                            {
                                "internalType": "enum MerchantRegistryStorage.Status",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "bool",
                                "name": "isActive",
                                "type": "bool"
                            },
                            {
                                "internalType": "uint256",
                                "name": "lastUsedDailyVolumeTimestamp",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "lastUsedMonthlyVolumeTimestamp",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct MerchantRegistryStorage.PaymentChannelDetails[]",
                        "name": "paymentChannels",
                        "type": "tuple[]"
                    }
                ],
                "indexed": false,
                "internalType": "struct MerchantRegistryStorage.MerchantConfig",
                "name": "merchantConfig",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "stake",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isOnline",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalVolume",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "withdrawnAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "lastVolumeResetTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "accruedFees",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isRegistered",
                        "type": "bool"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "currency",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "freeAmountUsdc",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "circleId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "delegatedStake",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct MerchantRegistryStorage.MerchantDetails",
                "name": "merchantDetails",
                "type": "tuple"
            }
        ],
        "name": "OnlineOfflineToggled",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_merchant",
                "type": "address"
            }
        ],
        "name": "getMerchantConfig",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "telegramId",
                        "type": "string"
                    },
                    {
                        "internalType": "enum MerchantRegistryStorage.RiskCategory",
                        "name": "riskCategory",
                        "type": "uint8"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "paymentChannelConfigId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "accountNo",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "label",
                                "type": "string"
                            },
                            {
                                "internalType": "enum MerchantRegistryStorage.Status",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "bool",
                                "name": "isActive",
                                "type": "bool"
                            },
                            {
                                "internalType": "uint256",
                                "name": "lastUsedDailyVolumeTimestamp",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "lastUsedMonthlyVolumeTimestamp",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct MerchantRegistryStorage.PaymentChannelDetails[]",
                        "name": "paymentChannels",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct MerchantRegistryStorage.MerchantConfig",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "merchant",
                "type": "address"
            }
        ],
        "name": "getFcmTokens",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "merchants",
                "type": "address[]"
            },
            {
                "internalType": "bool[]",
                "name": "desiredStatus",
                "type": "bool[]"
            }
        ],
        "name": "toggleOnlineOfflineByAdminOrGelato",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "currency",
                "type": "bytes32"
            },
            {
                "internalType": "address[]",
                "name": "prevs",
                "type": "address[]"
            },
            {
                "internalType": "address[]",
                "name": "targets",
                "type": "address[]"
            }
        ],
        "name": "removeNonEligibleMerchants",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "currency",
                "type": "bytes32"
            },
            {
                "internalType": "address[]",
                "name": "merchants",
                "type": "address[]"
            }
        ],
        "name": "toggleMerchantsOffline",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "ts",
                "type": "uint256"
            }
        ],
        "name": "timestampToDayIndex",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_orderId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_userEncUpi",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_pubKey",
                "type": "string"
            }
        ],
        "name": "acceptOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

export const DIAMOND_ABI = [...DIAMOND_EVENTS, ...DIAMOND_FUNCTIONS] as const;
