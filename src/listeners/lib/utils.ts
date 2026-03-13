import { JsonRpcProvider } from "ethers";
import { DIAMOND_ABI } from "../../helpers/abi";
import { Interface } from "ethers";
import ky from "ky";
import { logger } from "../../helpers/logger";

export const getEventsFromTransaction = async (
    provider: JsonRpcProvider,
    txHash: string,
    contractAddress: string
) => {
    try {
        if (!provider || !txHash || !contractAddress) return []
        const receipt = await provider.getTransactionReceipt(txHash)
        if (!receipt) return []

        const iface = new Interface(DIAMOND_ABI)
        const out: any[] = []

        for (const log of receipt.logs) {
            if (!log.address) continue
            if (log.address.toLowerCase() !== contractAddress.toLowerCase()) continue
            try {
                const parsed = iface.parseLog(log)
                out.push({
                    name: parsed?.name,
                    args: parsed?.args,
                    log
                })
            } catch (err) {
                // unable to parse with this interface — skip
                continue
            }
        }

        return out
    } catch (err: any) {
        logger.info(`❌ Error getting events from transaction: ${String(err.message)}`)
        return []
    }
}

export const sendNotification = async (
    fcmTokens: string[],
    merchant: string,
    orderId: string,
    currency: string,
    pushNotifXSecretKey: string,
    status: number,
    orderType: number,
    pushNotifBaseUrl: string,
    pushNotifImageUrl: string,
    pushNotifLandingUrl: string,
) => {
    const notifObject = {
        title: "-",
        description: "-",
    };
    if (status == 0) {
        if (currency === "Brl") {
            notifObject.title = "Pedido atribuído";
            notifObject.description = `Pedido ${orderId} atribuído a você, por favor aceite-o`;
        }
        else if (currency === "Ars" || currency === "Mex" || currency === "Ven") {
            notifObject.title = "Orden asignada";
            notifObject.description = `Orden ${orderId} asignada a usted, por favor acepte la orden`;
        }
        else if (currency === "Idr") {
            notifObject.title = "Pesanan ditugaskan";
            notifObject.description = `Pesanan ${orderId} ditugaskan kepada Anda, silakan terima pesanan tersebut`;
        }
        else {
            notifObject.title = "Order assigned";
            notifObject.description = `Order ${orderId} assigned to you, please accept it`;
        }
    }

    if (status == 2 && orderType == 0) {
        if (currency === "Brl") {
            notifObject.title = "Usuário Pagou";
            notifObject.description = `Usuário pagou para Pedido ${orderId}`;
        }
        else if (currency === "Ars" || currency === "Mex" || currency === "Ven") {
            notifObject.title = "Usuario Pagó";
            notifObject.description = `Usuario pagó para Orden ${orderId}`;
        }
        else if (currency === "Idr") {
            notifObject.title = "Pengguna Membayar";
            notifObject.description = `Pengguna membayar untuk Pesanan ${orderId}`;
        }
        else {
            notifObject.title = "User Paid";
            notifObject.description = `User paid for Order ${orderId}`;
        }
    }
    if (status == 2 && orderType != 0) {
        if (currency === "Brl") {
            notifObject.title = "Usuário Enviou ID de Pagamento";
            notifObject.description = `Usuário enviou id de pagamento para Pedido ${orderId}`;
        }
        else if (currency === "Ars" || currency === "Mex" || currency === "Ven") {
            notifObject.title = "Usuario Envió ID de Pago";
            notifObject.description = `Usuario envió id de pago para Orden ${orderId}`;
        }
        else if (currency === "Idr") {
            notifObject.title = "Pengguna Mengirim ID Pembayaran";
            notifObject.description = `Pengguna mengirim id pembayaran untuk Pesanan ${orderId}`;
        }
        else {
            notifObject.title = "User Sent Payment Id";
            notifObject.description = `User sent payment id for Order ${orderId}`;
        }
    }

    if (notifObject.title === "-" && notifObject.description === "-") {
        logger.info(`No matching notification type, skipping push notification`);
        return;
    }

    try {
        await ky.post(
            `${pushNotifBaseUrl}?merchantId=${merchant}&orderId=${orderId}`,
            {
                headers: {
                    "x-secret-key": pushNotifXSecretKey,
                    "Content-Type": "application/json",
                },
                json: {
                    tokens: fcmTokens,
                    title: notifObject.title,
                    description: notifObject.description,
                    imageUrl: pushNotifImageUrl,
                    url: pushNotifLandingUrl,
                    decrypt: true,
                },
            }
        );
    } catch (err: any) {
        logger.info(`❌ Error during event handling: ${String(err.message)}`);
    }
};