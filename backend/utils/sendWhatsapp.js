// import axios from "axios";

// const ULTRAMSG_INSTANCE_ID = process.env.REACT_APP_ULTRAMSG_INSTANCE_ID;
// const ULTRAMSG_TOKEN = process.env.REACT_APP_ULTRAMSG_TOKEN;
// const ULTRAMSG_API_URL = `https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`;

// const sendWhatsAppMessage = async (phoneNumber, message) => {
//     const message = `Thank you for your order! 🎉\n\n🛒 *Order ID:* ${orderId}\n💰 *Total Amount:* ₹${totalAmount}\n🚚 Your order will be delivered soon!\n\n- VCloset Team`;

//     try {
//         console.log(`Sending WhatsApp message to: ${phoneNumber}`);

//         const response = await axios.post(ULTRAMSG_API_URL, {
//             token: ULTRAMSG_TOKEN,
//             to: phoneNumber,
//             body: message,
//         });

//         console.log("WhatsApp Message Sent:", response.data);
//         return response.data;
//     } catch (error) {
//         console.error("Error sending WhatsApp message:", error.response ? error.response.data : error.message);
//         throw new Error("Failed to send WhatsApp message");
//     }
// };

// export default sendWhatsAppMessage;
