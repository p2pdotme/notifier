// event handlers
import { orderPlacedHandler } from '../listeners/handlers/OrderPlaced';
import { merchantsReAssignedHandler } from '../listeners/handlers/MerchantsReAssigned';
import { orderAcceptedHandler } from '../listeners/handlers/OrderAccepted';
import { buyOrderPaidHandler } from '../listeners/handlers/BuyOrderPaid';
import { sellOrderUpiSetHandler } from '../listeners/handlers/SellOrderUpiSet';
import { orderCompletedHandler } from '../listeners/handlers/OrderCompleted';
import { orderCancelledByHandler } from '../listeners/handlers/OrderCancelledBy';
import { orderDisputeHandler } from '../listeners/handlers/OrderDispute';
import { onlineOfflineToggledHandler } from '../listeners/handlers/OnlineOfflineToggled';

// scheduler handlers
import { priceNotifyHandler } from '../schedulers/handlers/PriceNotify';

export const handlers: Record<string, any> = {
    OrderPlaced: orderPlacedHandler,
    MerchantsReAssigned: merchantsReAssignedHandler,
    OrderAccepted: orderAcceptedHandler,
    BuyOrderPaid: buyOrderPaidHandler,
    SellOrderUpiSet: sellOrderUpiSetHandler,
    OrderCompleted: orderCompletedHandler,
    OrderCancelledBy: orderCancelledByHandler,
    OrderDispute: orderDisputeHandler,
    OnlineOfflineToggled: onlineOfflineToggledHandler,
    PriceNotify: priceNotifyHandler,
};
